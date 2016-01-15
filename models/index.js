"use strict";

const connection = require('./connection');

module.exports = {
    connection: connection,

    Sequelize: require('sequelize'),
    Item: require('./item'),
    Bid: require('./bid'),
    SlackMessage: require('./slack-message'),

    sync() {
        return connection.sync();
    },

    migrate() {
        console.error("I don't migrate often, but when I do, I use sequelize/umzug.");
    },
};
