"use strict";

const Talker = require('slackversational');
const Models = require('../../../models/');
const Messages = require('./messages.js');

module.exports = class GetSaleDescription extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "get-sale-description";
        this.questions = Messages.getItemDescription;
        this.responses = Messages.gotItemDescription;
    }


    handleResponding(exchange) {
        exchange.topic.item.description = exchange.value;
        return super.handleResponding(exchange);
    }
}
