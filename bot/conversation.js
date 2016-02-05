"use strict";

const _ = require('lodash');
const Talker = require('slackversational');
const Models = require('../models');
const Requests = require('./requests/');
const Abandoned = require('./validators/abandoned');
const log = require('../util/logger.js');
const config = require('../config/local.json');

module.exports.exclude = function(exchange) {
    if (exchange.channel.is_im) {
        return false;
    }

    if (exchange.value.indexOf(`<@${exchange.slack.self.id}>`) >= 0) {
        return false;
    }

    return true;
}

module.exports.load = function(conversation, exchange) {
    conversation.trickle.delay = config.pause;
    if (exchange.channel.is_im) {
        console.log("Loading private conversation");
        loadPrivate(conversation, exchange);
    } else {
        console.log("Loading public conversation");
        loadPublic(conversation, exchange);
    }
}


function loadPublic(conversation, exchange) {
    const help = new Requests.Help();
    help.on('asked', (x) => {
        conversation.end();
    });
    conversation.addRequest(help);
}


function loadPrivate(conversation, exchange) {
    const getAction = new Requests.GetAction();
    conversation.addRequest(getAction);

    const help = new Requests.Help();
    conversation.addRequest(help);

    const getBidItem = new Requests.GetBidItem();
    conversation.addRequest(getBidItem);

    const getBidAmount = new Requests.GetBidAmount();
    conversation.addRequest(getBidAmount);

    const getRaffleItem = new Requests.GetRaffleItem();
    const getAuctionItem = new Requests.GetAuctionItem();
    const getSaleDescription = new Requests.GetSaleDescription();
    const getSalePrice = new Requests.GetSalePrice();
    const getSaleQuantity = new Requests.GetSaleQuantity();
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
        'help': help,
    };

    // Handle the initial action
    getAction.on('valid', (x) => {
        if (x.value in actions) {
            setRequest(actions[x.value]);
        } else {
            x.ended = true;
        }
    });

    help.on('asked', (x) => {
        x.ended = true;
    });


    // Handle raffles and auctions.
    conversation.chain(
        getRaffleItem,
        getSaleQuantity,
        getSaleDescription,
        getSalePrice,
        getSaleChannel,
        getSaleDeadline,
        confirmSale
    );

    // We only need to start the chain for Auction items.
    // the rest is handled by the existing raffle chain
    conversation.chain(
        getAuctionItem,
        getSaleDescription
    );

    confirmSale.on('valid', (x) => {
        conversation.end();
    });

    // Handle bidding
    getBidItem.on('valid', (x) => {
        if (x.topic.item.type === "auction") {
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
