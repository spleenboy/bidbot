"use strict";

const Sequelize = require('sequelize');
const connection = require('./connection');
const Item = require('./item');

const Name = 'bid';

const Schema = {
    id: {
        type: Sequelize.UUID,
        unique: true,
        primaryKey: true,
    },
    buyerId: {
        type: Sequelize.STRING,
    },
    itemid: {
        type: Sequelize.UUID,
        references: {
            model: Item,
            key: 'id',
        }
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
    },
    addedOn: {
        type: Sequelize.DATE,
    }
};

const Settings = {
    freezeTableName: true,
};

const Model = connection.define(Name, Schema, Settings);

module.exports = Model;
