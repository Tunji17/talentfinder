require('dotenv').config({ path: '.env' });
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./lib/logger');
const config = require('./lib/config');
const { sendJSONResponse } = require('./lib/helpers');

require('./lib/model');

const apiRoutes = require('./lib/routes');

global.db = {
  Candidate: [],
};

const app = express();

app.use((req, res, next) => {
  const allowedOrigins = [''];
  const { origin } = req.headers;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1', apiRoutes);

app.use((req, res, next) => {
  const err = new Error('We apologize, there seems to be a problem with your request.');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => { //eslint-disable-line
  if (process.env.NODE_ENV !== 'test') {
    logger.error(`Internal Server Error ${err.message}`);
  }
  if (err.isBoom) {
    const { message } = err.data[0];
    sendJSONResponse(res, err.output.statusCode, null, req.method, message);
  } else if (err.status === 404) {
    sendJSONResponse(res, err.status, null, req.method, 'We apologize, there seems to be a problem with your request.');
  } else {
    sendJSONResponse(res, 500, null, req.method, err.message);
    throw err;
  }
});

app.listen(config.port, () => {
  logger.info(`talent finder is running on ${config.baseUrl} in ${process.env.NODE_ENV} environment`);
});

module.exports = {
  app,
};
