"use strict";

const Parser = require('slackversational').Parsers.Parser;

module.exports = class Action extends Parser {

    parse(value) {
        console.log(value);
        if (this.hasWord(value, "auction")) {
            return "auction";
        } else if (this.hasWord(value, "raffle")) {
            return "raffle";
        } else if (this.hasAnyWord(value, ['bid', 'buy', 'offer', 'list'])) {
            return "bid";
        }
        return null;
    }
}
