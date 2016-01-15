"use strict";

const EventEmitter = require('events');
const _ = require('lodash');
const Models = require('../models');
const INTERVAL_MS = 1000;

// This module enforces the deadlines of auctions and raffles
// Whenever an auction or raffle ends, an event is emitted
module.exports = class Timer extends EventEmitter {
    track() {
        this.ticker = setInterval(this.tick.bind(this), INTERVAL_MS);
        console.info("Starting interval to track winners");
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
            console.error("You added a new item type without telling me! How could you?");
        }
    }

    endAuction(item) {
        Models.Bid.findOne({
            where: {itemId: item.id},
            order: 'price DESC',
        })
        .then((winner) => {
            item.winnerId = winner ? winner.id : null;
            item.active = false;
            item.save();

            return this.emit("won", item, winner);
        });
    }

    endRaffle(item) {
        const sq = Models.connection;
        Models.Bid.findOne({
            where: {itemId: item.id},
            order: [sq.fn("RANDOM")]
        })
        .then((winner) => {
            item.winnerId = winner ? winner.id : null;
            item.active = false;
            item.save();

            return this.emit("won", item, winner);
        });
    }

    stop() {
        this.ticker && clearInterval(this.ticker);
    }
}
