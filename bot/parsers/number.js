"use strict";

const Parser = require('slackversational').Parsers.Parser;

module.exports = class ParseNumber extends Parser {
    parse(value) {
        let number = parseInt(value);
        number = isNaN(number) ? 1 : Math.round(number);
        return Math.max(1, number);
    }
}
