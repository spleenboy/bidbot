"use strict";

const Talker = require('slackversational');
const Messages = require('./messages');

module.exports = class Help extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "help";
    }

    handleAsking(exchange) {
        exchange.write(Messages.greetings);
        exchange.write(Messages.about);
        return exchange;
    }
}
