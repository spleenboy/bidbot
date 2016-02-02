"use strict";

const Talker = require('slackversational');
const Models = require('../../../models/');
const Messages = require('./messages.js');

module.exports = class GetAuctionItem extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "get-auction-item";
        this.questions = Messages.getAuctionItem;
        this.responses = Messages.gotAuctiontem;
    }


    handleResponding(exchange) {
        const item = Models.Item.build({
            channelId: exchange.input.channel,
            sellerId: exchange.input.user,
            name: exchange.input.text,
            type: "auction",
        });
        exchange.topic.item = item;
        return super.handleResponding(exchange);
    }
}
