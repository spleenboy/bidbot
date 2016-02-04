"use strict";

const Sequelize = require('sequelize');
const connection = require('./connection');
const Item = require('./item');

const Name = 'bid';

const Schema = {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
    },
    buyerId: {
        type: Sequelize.STRING,
    },
    itemId: {
        type: Sequelize.UUID,
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
    },
    winner: {
        type: Sequelize.BOOLEAN,
    }
};

const Settings = {
    freezeTableName: true,
};

const Model = connection.define(Name, Schema, Settings);

module.exports = Model;
