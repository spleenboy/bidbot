const bunyan = require('bunyan');
const config = require('../config/local');

const logger = bunyan.createLogger(config.logger);

module.exports = logger;
