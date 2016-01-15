"use strict";

const Sequelize = require('sequelize');
const connection = require('./connection');
const Item = require('./item');
const Bid = require('./bid');

// An exchange tracks the last thing the bot said to someone.
// This is necessary to allow asynchronous conversations.
const Name = 'exchange';

const Schema = {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
    },
    userId: {
        type: Sequelize.STRING,
    },
    channelId: {
        type: Sequelize.STRING,
    },
    itemId: {
        type: Sequelize.UUID,
        references: {
            model: Item,
            key: 'id',
        }
    },
    bidId: {
        type: Sequelize.UUID,
        references: {
            model: Bid,
            key: 'id',
        }
    },
    wanting: {
        type: Sequelize.STRING,
    },
};

const Settings = {
    freezeTableName: true,
};

const Model = connection.define(Name, Schema, Settings);

module.exports = Model;
