"use strict";

const _ = require('lodash');
const Talker = require('slackversational');
const Models = require('../models');
const Requests = require('./requests/');
const Abandoned = require('./validators/abandoned');
const log = require('../util/logger.js');

module.exports = function(conversation, exchange) {
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
    const confirmSale = new Requests.ConfirmSale();

    const abandoned = new Abandoned();

    conversation.on('preparing', (rq, x) => {
        abandoned.apply(x);
    });


    function setRequest(action) {
        action && conversation.setRequest((rq) => rq === action);
    }

    const actions = {
        'bid': getBidItem,
        'auction': getAuctionItem,
        'raffle': getRaffleItem,
    };

    // Handle the initial action
    getAction.on('valid', (x) => {
        if (x.value in actions) {
            setRequest(actions[x.value]);
        } else {
            conversation.end();
        }
    });


    // Handle raffles and auctions.
    conversation.chain(getRaffleItem, getSaleDescription, getSaleDeadline, getSaleChannel, confirmSale);
    conversation.chain(getAuctionItem, getSaleDescription, getSaleDeadline, getSaleChannel, confirmSale);

    confirmSale.on('valid', (x) => {
        conversation.end();
    });

    // Handle bidding
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
