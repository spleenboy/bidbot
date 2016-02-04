"use strict";

const Talker = require('slackversational');
const Messages = require('./messages.js');

module.exports = class GetSaleQuantity extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "get-sale-price";
        this.processors = [
            new Talker.Parsers.Currency(),
        ];
        this.questions = Messages.getItemPrice;
        this.responses = Messages.gotItemPrice;
    }


    handleResponding(exchange) {
        exchange.topic.item.price = exchange.value;
        return super.handleResponding(exchange);
    }
}
