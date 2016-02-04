"use strict";

const Talker = require('slackversational');
const ParseBoolean = require('../../parsers/boolean');
const Messages = require('./messages.js');

module.exports = class ConfirmSale extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "confirm-sale";
        this.processors = [new ParseBoolean()];
        this.questions = Messages.confirm;
    }


    handleAsking(exchange) {
        const item = exchange.topic.item;
        item.sellerId = exchange.input.user;
        return super.handleAsking(exchange);
    }


    handleResponding(exchange) {
        if (exchange.value === true) {
            exchange.write(Messages.confirmed);
            this.postSale(exchange.topic.item);
            return exchange;
        } else if (exchange.value === false) {
            exchange.write(Messages.cancelled);
            exchange.end = true;
            return exchange;
        } else {
            exchange.valid = false;
            exchange.write(Messages.confused);
            return exchange;
        }
    }


    postSale(exchange) {
        const item = exchange.topic.item;
        item.active = true;
        item.save();

        const pool = new Talker.StatementPool(Messages.post);
        const typist = new Talker.Typist(pool.bind(exchange));
        typist.send(item.channelId);
    }
}
