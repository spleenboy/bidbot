"use strict";

const Sequelize = require('sequelize');
const connection = require('./connection');
const Bid = require('./bid');
const Abbr = require('../util/abbr');

const Name = 'item';

const Schema = {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
    },
    abbr: {
        type: Sequelize.STRING,
    },
    channelId: {
        type: Sequelize.STRING,
    },
    sellerId: {
        type: Sequelize.STRING,
    },
    type: {
        type: Sequelize.ENUM('auction', 'raffle'),
    },
    name: {
        type: Sequelize.STRING,
        set: function(val) {
            this.setDataValue('name', val);

            const abbr = new Abbr(val);
            this.setDataValue('abbr', abbr.value);
        }
    },
    description: {
        type: Sequelize.STRING,
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
    },
    quantity: {
        type: Sequelize.INTEGER,
    },
    highBid: {
        type: Sequelize.DECIMAL(10, 2),
    },
    active: {
        type: Sequelize.BOOLEAN,
    },
    endsOn: {
        type: Sequelize.DATE,
    },
};

const Settings = {
    freezeTableName: true,
};

const Model = connection.define(Name, Schema, Settings);

module.exports = Model;
