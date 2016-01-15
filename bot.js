"use strict";

const _ = require('lodash');
const moment = require('moment');
const config = require('./config/local.json');
const Models = require('./models');
const messages = require('./config/messages');

module.exports = class Bot {
    constructor(slack) {
        Models.sync()
        .then(() => {
            console.info("Models synced");
            if (slack) {
                this.connect(slack);
            }
        });
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
        console.log(`Connected to ${this.slack.team.name} as @${this.slack.self.name}`);
    }


    error(err, text) {
        console.error(text || 'Slack error', err);
    }


    message(original) {
        const msg = new Models.SlackMessage(original, this.slack);

        if (msg.isIM()) {
            return this.handleIM(msg);
        }
    }


    // Sends one or messages to the channel.
    say(channel, key, ctx) {
        function send(msg) {
            if (_.isFunction(msg)) {
                msg = msg(ctx || channel);
            }
            if (!msg) {
                console.error("No value for key", key, msg);
                return;
            }
            channel.send(msg);
        }

        const value = messages[key];

        if (!_.isArray(value)) {
            send(value);
            return value;
        }

        const chosen = _.sample(value);

        if (!_.isArray(chosen)) {
            send(chosen);
            return chosen;
        }

        let delay = 0;
        chosen.forEach(msg => {
            setTimeout(send.bind(this, msg), delay);
            delay += config.pause;
        });
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
                this.say(msg.channel, "greeting");
                this.getAction(exchange, msg);
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
            }
            this.say(msg.channel, "getAction");
            exchange.wanting = "getAction";
            exchange.save();
        }
    }


    startBidding(exchange, msg) {
        Models.Item.findAll({
            where: {active: true},
            order: 'endsOn DESC',
        })
        .then((items) => {
            if (!items || items.length === 0) {
                this.say(msg.channel, "noItemsForBid");
                exchange.destroy();
                return;
            }
            this.say(msg.channel, "itemsForBid");

            const list = [];
            items.forEach((item) => {
                const article = item.type === 'auction' ? 'an' : 'a';
                const deadline = moment(item.endsOn).toNow();
                list.push(` - _${item.name}_ is ${article} ${item.type} that ends ${deadline}`);
            });

            msg.channel.send(list.join("\n"));
            this.say(msg.channel, "getBidItem", items);
            exchange.wanting = "getBidItem";
            exchange.save();
        });
    }


    getBidItem(exchange, msg) {

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
            this.say(msg.channel, "getItemEndsOn");
            return;
        }
        this.getItemFieldValue(exchange, msg, "endsOn", endsOn, "getItemChannel");
    }


    getItemChannel(exchange, msg) {
        const channelId = msg.getChannelId();
        if (channelId === false || !this.slack.getChannelGroupOrDMByID(channelId)) {
            console.error("Invalid channel", channelId, msg.text);
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
                exchange.destroy();
            } else if (msg.hasDenial()) {
                this.say(msg.channel, "itemSaleCanceled", item);
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
            if (item.channelId) item.channel = this.slack.getChannelGroupOrDMByID(item.channelId);
            if (item.sellerId) item.seller = this.slack.getUserByID(item.sellerId);
            if (item.endsOn) item.deadline = moment(item.endsOn).fromNow();
            return item;
        });
    }
}
