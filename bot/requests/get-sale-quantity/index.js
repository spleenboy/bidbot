"use strict";

const Talker = require('slackversational');
const Messages = require('./messages.js');
const ParseNumber = require('../../parsers/number');

module.exports = class GetSaleQuantity extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "get-sale-quantity";
        this.processors = [
            new ParseNumber(),
        ];
        this.questions = Messages.getItemQuantity;
        this.responses = Messages.gotItemQuantity;
    }


    handleResponding(exchange) {
        exchange.topic.item.quantity = exchange.value;
        return super.handleResponding(exchange);
    }
}
