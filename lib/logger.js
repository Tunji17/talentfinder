const bunyan = require('bunyan');
const config = require('./config');

module.exports = bunyan.createLogger({
  name: 'talent finder',
  level: config.logger.level,
});
