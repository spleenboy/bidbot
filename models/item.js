"use strict";

const Sequelize = require('sequelize');
const connection = require('./connection');
const Bid = require('./bid');

const Name = 'item';

const Schema = {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
    },
    postId: {
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
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
    },
    active: {
        type: Sequelize.BOOLEAN,
    },
    startsOn: {
        type: Sequelize.DATE,
    },
    endsOn: {
        type: Sequelize.DATE,
    },
    winnerId: {
        type: Sequelize.UUID,
        references: {
            model: Bid,
            key: 'id',
        }
    },
};

const Settings = {
    freezeTableName: true,
};

const Model = connection.define(Name, Schema, Settings);

module.exports = Model;
