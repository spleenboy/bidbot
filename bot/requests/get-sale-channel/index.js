"use strict";

const Talker = require('slackversational');
const Models = require('../../../models/');
const ParseChannel = require('../../parsers/channel');
const Confused = require('../../validators/confused');
const Messages = require('./messages.js');

module.exports = class GetSaleChannel extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "get-sale-channel";
        this.processors = [
            new ParseChannel(),
            new Confused()
        ];
        this.questions = Messages.getSaleChannel;
        this.responses = Messages.gotSaleChannel;
    }


    handleResponding(exchange) {
        exchange.topic.item.channelId = exchange.value;
        return super.handleResponding(exchange);
    }
}
