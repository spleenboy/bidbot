"use strict";

const Talker = require('slackversational');
const Models = require('../../../models/');
const Messages = require('./messages.js');
const ParseAction = require('../../parsers/action');
const ItemsByAbbr = require('../../parsers/items-by-abbr');
const OneBidItem = require('../../validators/one-bid-item');

module.exports = class GetBidItem extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "get-bid-item";
        this.processors = [
            new ItemsByAbbr(),
            new OneBidItem(),
        ];
    }


    handleAsking(exchange) {
        return Models.Item.findAll({
            where: {active: true},
            order: 'endsOn',
        })
        .then((items) => {
            exchange.items = items;
            if (!items || items.length === 0) {
                exchange.write(Messages.noItemsForBid);
                exchange.ended = true;
            } else {
                exchange.write(Message.itemsForBid);
                exchange.write(Messages.getBidItem);
            }
        });
    }


    handleResponding(exchange) {
        if (!exchange.valid || !exchange.value) {
            return;
        }

        const item = exchange.value[0];
        return Models.Bid.findOrCreate({
            where: {
                buyerId: exchange.input.user,
                itemId: item.id,
            }
        }).spread((bid, created) => {
            exchange.item = item;
            exchange.bid = bid;
            if (item.type === "auction") {
                // Let the conversation move to getting bid amount
                return;
            } else if (created) {
                exchange.write(messages.bidReceived);
            } else {
                exchange.write(messages.bidReceivedAlready);
            }
            exchange.ended = true;
        });
    }
}
