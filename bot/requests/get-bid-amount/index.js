"use strict";

const Talker = require('slackversational');
const _ = require('lodash');
const Messages = require('./messages');
const Models = require('../../../models/');
const Confused = require('../../validators/confused');
const ValidateBidAmount = require('../../validators/bid-amount');

module.exports = class GetBidAmount extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "get-bid-amount";
        this.processors = [
            new Talker.Parsers.Currency(),
            new Confused(),
            new ValidateBidAmount(),
        ];
        this.questions = Messages.getBidAmount;
        this.responses = Messages.bidReceived;
    }


    handleResponding(exchange) {
        if (exchange.valid) {
            exchange.topic.bid.price = parseFloat(exchange.value);
            exchange.topic.bid.save();
            exchange.write(this.responses);
            exchange.ended = true;
        }
        return exchange;
    }
}
