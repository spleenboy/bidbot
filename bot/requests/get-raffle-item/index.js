"use strict";

const Talker = require('slackversational');
const Models = require('../../../models/');
const Messages = require('./messages.js');

module.exports = class GetRaffleItem extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "get-raffle-item";
        this.questions = Messages.getItemName;
        this.responses = Messages.gotItemName;
    }


    handleResponding(exchange) {
        const item = Models.Item.build({
            channelId: exchange.input.channel,
            sellerId: exchange.input.user,
            name: exchange.input.text,
            type: "raffle",
        });
        exchange.topic.item = item;
        return super.handleResponding(exchange);
    }
}
