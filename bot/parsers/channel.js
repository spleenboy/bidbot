"use strict";

const Parser = require('slackversational').Parsers.Parser;

module.exports = class Channel extends Parser {
    parse(value) {
        const check = /<#(C[a-zA-Z0-9]+)(\||>)/;
        const matches = check.exec(value);
        return matches ? matches[1] : null;
    }
}
