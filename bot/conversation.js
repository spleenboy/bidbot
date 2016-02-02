"use strict";

const Talker = require('slackversational');
const Models = require('../models');
const Requests = require('./requests/');
const log = require('../util/logger.js');

module.exports.load = function(conversation, exchange) {
    const getAction = new Requests.GetAction();
    conversation.addRequest(getAction);

    const getBidItem = new Requests.GetBidItem();
    conversation.addRequest(getBidItem);

    const getBidAmount = new Requests.GetBidAmount();
    conversation.addRequest(getBidAmount);

    const getRaffleItem = new Requests.GetRaffleItem();
    conversation.addRequest(getRaffleItem);

    const getAuctionItem = new Requests.GetAuctionItem();
    conversation.addRequest(getAuctionItem);

    const getSaleDescription = new Requests.GetSaleDescription();
    conversation.addRequest(getSaleDescription);


    getAction.on('valid', (x) => {
        let action = null;
        if (x.value === 'bid') {
            action = getBidItem;
        } else if (x.value === 'raffle') {
            action = getRaffleItem;
        } else if (x.value === 'auction') {
            action = getAuctionItem;
        }

        action && conversation.setRequest((rq) => rq === action);
    });


    getBidItem.on('valid', (x) => {
        if (x.item.type === "auction") {
            conversation.setRequest((rq) => rq === getBidAmount);
        } else {
            conversation.end();
        }
    });


    getRaffleItem.on('valid', (x) => {
        conversation.setRequest((rq) => rq === getSaleDescription);
    });

    getAuctionItem.on('valid', (x) => {
        conversation.setRequest((rq) => rq === getSaleDescription);
    });


    log.debug("Loaded conversation for exchange", exchange.input.text);
}
