"use strict";

const Talker = require('slackversational');
const Models = require('../../../models/');
const Confused = require('../../validators/confused');
const Messages = require('./messages.js');

module.exports = class GetSaleDeadline extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "get-sale-deadline";
        this.processors = [
            new Talker.Parsers.FutureDate(),
            new Confused()
        ];
        this.questions = Messages.getItemDeadline;
        this.responses = Messages.gotItemDeadline;
    }


    handleResponding(exchange) {
        exchange.topic.item.endsOn = exchange.value;
        return super.handleResponding(exchange);
    }
}
