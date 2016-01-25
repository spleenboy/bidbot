"use strict";

const Parser = require('slackversational/parsers/parser');

module.exports = class Abandoned extends Parser {

    parse(value) {
        return /^(nm|nevermind|never mind|cancel|stop|abort)$/i.test(value);
    }
}
