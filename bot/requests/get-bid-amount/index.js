"use strict";

const Talker = require('slackversational');
const _ = require('lodash');
const Messages = require('./messages');
const Models = require('../../../models/');
const Confused = require('../../validators/confused');

module.exports = class GetBidAmount extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "get-bid-amount";
        this.processors = [
            new Talker.Parsers.Currency(),
            new Confused(),
        ];
        this.questions = Messages.getBidAmount;
        this.responses = Messages.bidReceived;
    }


    validateBidAmount(exchange) {
        const amount = _.toFloat(exchange.value);
        const item = exchange.item;

        if (amount < item.price) {
            exchange.valid = false;
            exchange.write(Messages.bidBelowPrice);
            return;
        } else if (item.highBid && amount <= item.highBid) {
            exchange.valid = false;
            exchange.write(Messages.bidBelowHighBid);
        }
    }


    handleResponding(exchange) {
        return super.handleResponding(exchange)
        .then(() => {
            this.validateBidAmount(exchange)
            if (exchange.valid) {
                exchange.bid.price = exchange.value;
                exchange.bid.save();
                exchange.ended = true;
            }
        });
    }
}
