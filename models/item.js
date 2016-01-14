"use strict";

const Sequelize = require('sequelize');
const connection = require('./connection');
const Bid = require('./bid');

const Name = 'item';

const Schema = {
    id: {
        type: Sequelize.UUID,
        unique: true,
        primaryKey: true,
    },
    postId: {
        type: Sequelize.STRING,
    },
    sellerId: {
        type: Sequelize.STRING,
    },
    active: {
        type: Sequelize.BOOLEAN,
    },
    name: {
        type: Sequelize.STRING,
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
    },
    winnerId: {
        type: Sequelize.UUID,
        references: {
            model: Bid,
            key: 'id',
        }
    },
    type: {
        type: Sequelize.ENUM('auction', 'raffle'),
    },
    startsOn: {
        type: Sequelize.DATE,
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
