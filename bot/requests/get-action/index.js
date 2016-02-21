"use strict";

const Talker = require('slackversational');
const Messages = require('./messages');
const ParseAction = require('../../parsers/action');
const Confused = require('../../validators/confused');

module.exports = class GetAction extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "get-action";
        this.processors = [
            new ParseAction(),
            new Confused(),
        ];
    }


    handleAsking(exchange) {
        if (this.asked === 0) {
            exchange.write(Messages.hello);
        }
        const parseAction = new ParseAction();
        parseAction.apply(exchange)
        .then(() => {
            if (exchange.value) {
                exchange.valid = true;
                this.emit('valid', exchange);
            } else {
                exchange.write(Messages.getAction);
            }
            return exchange;
        });
    }
}
