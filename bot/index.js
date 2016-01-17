"use strict";

const _ = require('lodash');
const moment = require('moment');
const config = require('../config/local.json');
const messages = require('../config/messages');
const Trickle = require('../util/trickle');
const logger = require('./logger');
const Incoming = require('./incoming');

const Models = require('../models');
const Winners = require('./winners');

module.exports = class Bot {
    constructor(slack) {
        Models.sync()
        .then(() => {
            logger.info("Models synced");
            if (slack) {
                this.connect(slack);
            }
        });
        this.trickle = new Trickle();
        this.trickle.delay = config.pause;
    }


    connect(slack) {
        this.slack = slack;

        slack.on('open', this.open.bind(this));
        slack.on('error', this.error.bind(this));
        slack.on('message', (original) => {
            try {
                this.message(original);
            } catch (e) {
                this.error(e, "Error processing message");
            }
        });
    }


    open() {
        this.winners = new Winners();
        this.winners.on('won', this.bidWon.bind(this));
        this.winners.track();
        logger.info(`Connected to ${this.slack.team.name} as @${this.slack.self.name}`);
    }


    error(err, text) {
        logger.error(text || 'Slack error', err);
    }


    message(original) {
        const msg = new Incoming(original, this.slack);

        if (msg.isIM()) {
            return this.handleIM(msg);
        }
    }


    // Sends one or messages to the channel.
    // Queues up the messages to seem creepily human.
    say(channel, key, ctx) {

        const self = this;

        function queue(msg) {
            if (_.isFunction(msg)) {
                msg = msg(ctx || channel);
            }
            if (!msg) {
                logger.error("No value for key", key, msg);
                return;
            }
            self.trickle.add(channel.send.bind(channel, msg));
        }

        const value = messages[key];

        if (!_.isArray(value)) {
            queue(value);
            return value;
        }

        const chosen = _.sample(value);

        if (!_.isArray(chosen)) {
            queue(chosen);
            return chosen;
        }

        chosen.forEach(queue);
        return chosen.join("\n");
    }


    handleIM(msg) {
        Models.Exchange.findOrCreate({
            where: {
                userId: msg.user.id,
                channelId: msg.channel.id,
            }
        })
        .spread((exchange, created) => {
            if (!exchange.wanting) {
                this.getAction(exchange, msg);
            } else if (msg.isAbandoned()) {
                exchange.destroy();
                this.say(msg.channel, "abandoned");
            } else {
                this[exchange.wanting](exchange, msg);
            }
        });
    }


    getAction(exchange, msg) {
        if (msg.hasWord("auction")) {
            this.startSale(exchange, msg, "auction");
        } else if (msg.hasWord("raffle")) {
            this.startSale(exchange, msg, "raffle");
        } else if (msg.hasBid()) {
            this.startBidding(exchange, msg);
        } else {
            // Got a weird response. What?
            if (exchange.wanting) {
                this.say(msg.channel, "confused");
            } else {
                this.say(msg.channel, "greeting");
            }
            this.say(msg.channel, "getAction");
            exchange.wanting = "getAction";
            exchange.save();
        }
    }


    startBidding(exchange, msg) {
        Models.Item.findAll({
            where: {active: true},
            order: 'endsOn',
        })
        .then((items) => {
            if (!items || items.length === 0) {
                this.say(msg.channel, "noItemsForBid");
                exchange.destroy();
                return;
            }

            this.say(msg.channel, "itemsForBid");

            const list = [];
            items.forEach((item, i) => {
                const article = item.type === 'auction' ? 'an' : 'a';
                const deadline = moment(item.endsOn).fromNow();
                list.push(` • *${item.abbr}*: _${item.name}_ is ${article} ${item.type} that ends ${deadline}`);
            });

            this.trickle.add(msg.channel.send.bind(msg.channel, list.join("\n")));
            this.say(msg.channel, "getBidItem", items);

            exchange.wanting = "getBidItem";
            exchange.save();
        });
    }


    getBidItem(exchange, msg) {
        Models.Item.findAll({
            where: {
                abbr: {$like: msg.text},
                active: true,
            }
        })
        .then((items) => {
            if (!items || items.length === 0) {
                this.say(msg.channel, "bidItemNotFound");
                this.startBidding(exchange, msg);
            } else if (items.length > 1) {
                this.say(msg.channel, "bidItemFoundMany");
                this.startBidding(exchange, msg);
            } else {
                const item = items[0];
                Models.Bid.findOrCreate({
                    where: {
                        buyerId: msg.user.id,
                        itemId: item.id
                    }
                })
                .spread((bid, created) => {
                    bid.item = item;
                    if (item.type === "auction") {
                        exchange.bidId = bid.id;
                        exchange.wanting = "getBidPrice";
                        exchange.save();
                        this.say(msg.channel, "getBidPrice", item);
                    } else if (created) {
                        this.say(msg.channel, "bidReceived", bid);
                        exchange.destroy();
                    } else {
                        this.say(msg.channel, "bidReceivedAlready", bid);
                        exchange.destroy();
                    }
                });
            }
        });
    }


    getBidPrice(exchange, msg) {
        const amount = msg.getPrice();

        this.getFullBid(exchange.bidId)
        .then((myBid) => {
            if (amount === false) {
                this.say(msg.channel, "confused");
                this.say(msg.channel, "getBidPrice", myBid.item);
                return;
            }

            // Find the high bid
            this.getHighBid(myBid.item.id)
            .then((highBid) => {
                if (highBid && highBid.price > amount) {
                    this.say(msg.channel, "bidTooLow", highBid);
                    this.say(msg.channel, "getBidPrice", myBid.item);
                    return;
                } else {
                    myBid.price = amount;
                    myBid.save();
                    this.say(msg.channel, "bidReceived", myBid);
                    exchange.destroy();
                }
            });
        });
    }


    startSale(exchange, msg, type) {
        Models.Item.create({
            sellerId: msg.user.id,
            type: type,
        })
        .then((item) => {
            this.say(msg.channel, "getItemName", item);
            exchange.itemId = item.id;
            exchange.wanting = "getItemName";
            exchange.save();
        });
    }


    getItemFieldValue(exchange, msg, field, value, nextStep) {
        if (!exchange.itemId) {
            this.say(msg.channel, "confused");
            this.getAction(exchange, msg);
            return;
        }

        this.getFullItem(exchange.itemId)
        .then((item) => {
            if (!item) {
                this.say(msg.channel, "error", `Couldn't find your item with id ${exchange.itemId}`);
                return;
            }

            item[field] = value;
            item.save();

            this.say(msg.channel, nextStep, item);
            exchange.wanting = nextStep;
            exchange.save();
        });
    }


    getItemName(exchange, msg) {
        this.getItemFieldValue(exchange, msg, "name", msg.text, "getItemDescription");
    }


    getItemDescription(exchange, msg) {
        this.getItemFieldValue(exchange, msg, "description", msg.text, "getItemPrice");
    }


    getItemPrice(exchange, msg) {
        const amount = msg.getPrice();
        if (amount === false) {
            // Try again.
            this.say(msg.channel, "confused");

            this.getFullItem(exchange.itemId)
            .then((item) => {
                this.say(msg.channel, "getItemPrice", item);
            })
            return;
        }
        this.getItemFieldValue(exchange, msg, "price", amount, "getItemEndsOn");
    }


    getItemEndsOn(exchange, msg) {
        const endsOn = msg.getDate();
        if (endsOn === false) {
            this.say(msg.channel, "confused");
            this.getFullItem(exchange.itemId)
            .then((item) => {
                this.say(msg.channel, "getItemEndsOn", item);
            });
            return;
        }
        this.getItemFieldValue(exchange, msg, "endsOn", endsOn, "getItemChannel");
    }


    getItemChannel(exchange, msg) {
        const channelId = msg.getChannelId();
        if (channelId === false || !this.slack.getChannelGroupOrDMByID(channelId)) {
            logger.error("Invalid channel", channelId, msg.text);
            this.say(msg.channel, "confused");
            this.say(msg.channel, "getItemChannel");
            return;
        }
        this.getItemFieldValue(exchange, msg, "channelId", channelId, "confirmItemSale");
    }


    confirmItemSale(exchange, msg) {
        this.getFullItem(exchange.itemId)
        .then((item) => {
            if (msg.hasConfirmation()) {
                this.say(item.channel, "itemPost", item);
                this.say(msg.channel, "itemSaleConfirmed", item);
                item.active = true;
                item.save();
                exchange.destroy();
            } else if (msg.hasDenial()) {
                this.say(msg.channel, "itemSaleCanceled", item);
                item.destroy();
                exchange.destroy();
            } else {
                this.say(msg.channel, "confused");
                this.say(msg.channel, "confirmItemSale", item);
            }
        });
    }


    getFullItem(id) {
        return Models.Item.findById(id)
        .then((item) => {
            if (!item) {
                return null;
            }
            this.decorateItem(item);
            return item;
        });
    }


    decorateItem(item) {
        if (!item) return;
        if (item.channelId) item.channel = this.slack.getChannelGroupOrDMByID(item.channelId);
        if (item.sellerId) item.seller = this.slack.getUserByID(item.sellerId);
        if (item.endsOn) item.deadline = moment(item.endsOn).fromNow();
    }


    getFullBid(id) {
        return Models.Bid.findById(id)
        .then((bid) => {
            return this.getFullItem(bid.itemId)
            .then((item) => {
                bid.item = item;
                this.decorateBid(bid);
                return bid;
            });
        });
    }


    decorateBid(bid) {
        if (!bid) return;
        if (bid.buyerId) bid.buyer = this.buyerId = this.slack.getUserByID(bid.buyerId);
    }


    getHighBid(itemId) {
        return Models.Bid.findOne({
            where: {itemId: itemId},
            order: 'price DESC',
        });
    }


    bidWon(item, bid) {
        this.decorateItem(item);
        this.decorateBid(bid);

        if (!item.channel) {
            logger.error("No channel found for winning bid on item", item, bid);
        }

        item.winner = bid;
        logger.info("Winner winner", item);
        let state = bid ? item.type + "Won" : item.type + "Lost";
        this.say(item.channel, state, item);
    }
}
