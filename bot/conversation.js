"use strict";

const Talker = require('slackversational');
const Models = require('../models');
const Requests = require('./requests/');
const log = require('../util/logger.js');

// An override the the dispatcher create method
module.exports.load = function(conversation, exchange) {
    const getAction = new Requests.GetAction();
    conversation.addRequest(getAction);

    const getBidItem = new Requests.GetBidItem();
    conversation.addRequest(getBidItem);

    const getBidAmount = new Requests.GetBidAmount();
    conversation.addRequest(getBidAmount);


    getAction.on('valid', (x) => {
        let action = null;
        switch (x.value) {
            case 'auction':
            case 'raffle':
                break;
            case 'bid':
                action = getBidItem;
        }
        conversation.setRequest((rq) => rq === action);
    });
    getAction.on('invalid', (x) => {
        log.debug('invalid', x);
    });


    getBidItem.on('valid', (x) => {
        conversation.item = x.item;
        conversation.bid = x.bid;
        if (item.type === "auction") {
            conversation.setRequest((rq) => rq.id === "get-bid-amount");
        } else {
            conversation.end();
        }
    });


    getBidAmount.on('processing', (request, x) => {
        x.item = conversation.item;
        x.bid = conversation.bid;
    });

    log.debug("Loaded conversation for exchange", exchange.input.text);
}
