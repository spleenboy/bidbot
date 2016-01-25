"use strict";

const Parser = require('slackversational/parsers/parser');

module.exports = class Action extends Parser {

    static get AUCTION {
        return "auction";
    }

    static get RAFFLE {
        return "raffle";
    }

    static get BID {
        return "bid";
    }

    parse(value) {
        if (msg.hasWord("auction")) {
            return this.AUCTION;
        } else if (msg.hasWord("raffle")) {
            return this.RAFFLE;
        } else if (msg.hasAnyWord(['bid', 'buy', 'offer', 'list'])) {
            return this.BID;
        }
        return null;
    }
}
