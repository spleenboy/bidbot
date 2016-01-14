"use strict";

const Sequelize = require('sequelize');
const config = require('../config/local.json');
const db = config.database;
const connection = new Sequelize(db.name, db.username, db.password, db.settings);

module.exports = connection;
