"use strict";

const _ = require('lodash');
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
    const getAuctionItem = new Requests.GetAuctionItem();
    const getSaleDescription = new Requests.GetSaleDescription();
    const getSaleDeadline = new Requests.GetSaleDeadline();
    const getSaleChannel = new Requests.GetSaleChannel();


    function setRequest(action) {
        action && conversation.setRequest((rq) => rq === action);
    }

    // Handle the initial action
    getAction.on('valid', (x) => {
        let action = null;
        if (x.value === 'bid') {
            setRequest(getBidItem);
        } else if (x.value === 'raffle') {
            setRequest(getRaffleItem);
        } else if (x.value === 'auction') {
            setRequest(getAuctionItem);
        } else {
            conversation.end();
        }
    });


    // Handle raffles and auctions.
    conversation.chain(getRaffleItem, getSaleDescription, getSaleDeadline, getSaleChannel);
    conversation.chain(getAuctionItem, getSaleDescription, getSaleDeadline, getSaleChannel);


    getBidItem.on('valid', (x) => {
        if (x.item.type === "auction") {
            setRequest(getBidAmount);
        } else {
            conversation.end();
        }
    });


    getBidAmount.on('valid', (x) => {
        conversation.end();
    });

    log.debug("Loaded conversation for exchange", exchange.input.text);
}
