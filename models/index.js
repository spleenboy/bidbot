"use strict";

const connection = require('./connection');
const logger = require('../bot/logger');

module.exports = {
    connection: connection,

    Sequelize: require('sequelize'),
    Item: require('./item'),
    Bid: require('./bid'),
    Exchange: require('./exchange'),
    SlackMessage: require('./slack-message'),

    sync() {
        return connection.sync();
    },

    migrate() {
        logger.error("I don't migrate often, but when I do, I use sequelize/umzug.");
    },
};
