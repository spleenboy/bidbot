"use strict";

const EventEmitter = require('events');
const _ = require('lodash');
const Talker = require('slackversational');
const Models = require('../../models');
const logger = require('../../util/logger');
const Messages = require('./messages');
const INTERVAL_MS = 1000;

// This module enforces the deadlines of auctions and raffles
// Whenever an auction or raffle ends, an event is emitted
module.exports = class Winners extends EventEmitter {
    constructor(slack) {
        super();
    }

    track() {
        this.ticker = setInterval(this.tick.bind(this), INTERVAL_MS);
        logger.info("Starting interval to track winners");
    }

    tick() {
        Models.Item.findAll({
            where: {
                active: true,
                endsOn: {$lt: new Date()},
            }
        })
        .then(items => {
            if (!items || items.length === 0) {
                return;
            }
            items.forEach(this.endItem.bind(this));
        });
    }


    endItem(item) {
        if (item.type === "raffle") {
            this.endRaffle(item);
        } else if (item.type === "auction") {
            this.endAuction(item);
        } else {
            logger.error("You added a new item type without telling me! How could you?");
        }
    }

    endAuction(item) {
        Models.Bid.findOne({
            where: {itemId: item.id},
            order: 'price DESC',
        })
        .then((bid) => {
            item.active = false;
            item.save();

            if (bid) {
                bid.winner = true;
                bid.save();
            }

            const result = bid ? [bid] : [];
            this.announce(item, result);
            return this.emit("won", item, result);
        });
    }

    endRaffle(item) {
        const sq = Models.connection;
        Models.Bid.findAll({
            where: {itemId: item.id},
            order: [sq.fn("RANDOM")],
            limit: item.quantity,
        })
        .then((bids) => {
            item.active = false;
            item.save();

            if (bids) {
                bids.forEach(bid => {
                    bid.winner = true;
                    bid.save();
                });
            }

            this.announce(item, bids);
            return this.emit("won", item, bids);
        });
    }

    announce(item, bids) {
        const ctx = {item, bids};
        const statements = bids && bids.length ? Messages.won(ctx) : Messages.lost(ctx);
        const pool = new Talker.StatementPool(statements);

        const messages = pool.bind(ctx);
        const trickle = new Talker.Trickle();

        messages.forEach((text) => {
            const msg = {
                text: text,
                channel: item.channelId
            };
            trickle.add(this.emit.bind(this, 'say', msg));
        });
    }

    stop() {
        this.ticker && clearInterval(this.ticker);
    }
}
