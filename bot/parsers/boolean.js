"use strict";

const Parser = require('slackversational').Parsers.Parser;

module.exports = class Boolean extends Parser {
    parse(value) {
        if (this.hasAnyWord(value, ['y', 'yes','yeah', 'yup', 'ok', 'sure', 'fine', 'right', 'correct'])) {
            return true;
        }
        if (this.hasAnyWord(value, ['n', 'no', 'cancel', 'nope', 'none', 'nm', 'wrong'])) {
            return false;
        }
        return value;
    }
}
