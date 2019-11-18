const testConfig = require('./test');
const config = require('./development');

if (process.env.NODE_ENV === 'test') {
  module.exports = { ...config, ...testConfig };
} else {
  module.exports = config;
}
