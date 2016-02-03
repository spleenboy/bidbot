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
    conversation.addRequest(getRaffleItem);

    const getAuctionItem = new Requests.GetAuctionItem();
    conversation.addRequest(getAuctionItem);

    const getSaleDescription = new Requests.GetSaleDescription();
    conversation.addRequest(getSaleDescription);

    const getSaleDeadline = new Requests.GetSaleDeadline();
    conversation.addRequest(getSaleDeadline);


    function setRequest(action) {
        action && conversation.setRequest((rq) => rq === action);
    }


    // Chains together multiple actions to be called
    // in succession on valid exchanges.
    function chain() {
        const args = _.toArray(arguments);
        let current = args.shift();
        while (current) {
            const next = args.shift();
            if (next) {
                console.log('chained', current.id, 'to', next.id);
                current.on('valid', setRequest.bind(conversation, next));
            }
            current = next;
        }
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
    chain(getRaffleItem, getSaleDescription, getSaleDeadline);
    chain(getAuctionItem, getSaleDescription, getSaleDeadline);


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
