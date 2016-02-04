"use strict";

const Validator = require('slackversational').Validators.Validator;
const _ = require('lodash');
const Messages = require('../requests/get-bid-amount/messages');

module.exports = class BidAmount extends Validator {
    apply(exchange) {
        if (!exchange.valid) {
            return exchange;
        }

        const item = exchange.topic.item;

        if (!item.price) {
            return exchange;
        }

        const amount = parseFloat(exchange.value);

        if (amount < parseFloat(item.price)) {
            exchange.valid = false;
            exchange.write(Messages.bidBelowPrice);
            return;
        } else if (item.highBid && amount <= item.highBid) {
            exchange.valid = false;
            exchange.write(Messages.bidBelowHighBid);
        }
    }
}
