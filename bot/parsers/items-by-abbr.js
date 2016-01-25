"use strict";

const Parser = require('slackversational/parsers/parser');
const Models = require('../../models');

module.exports = class ItemsByAbbr extends Parser {
    parse(value) {
        return Models.Item.findAll({
            where: {
                abbr: {$like: value},
                active: true,
            }
        });
    }
}
