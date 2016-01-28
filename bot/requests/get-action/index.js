"use strict";

const Talker = require('slackversational');
const Messages = require('./messages');
const ParseAction = require('../../parsers/action');
const Confused = require('../../validators/confused');

module.exports = class GetAction extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "get-action";
        this.questions = Messages.getAction;
        this.processors = [
            new ParseAction(),
            new Confused()
        ];
        this.responses = [];
    }


    handleAsking(exchange) {
        const parseAction = new ParseAction();
        parseAction.apply(exchange)
        .then(() => {
            console.log("Checked action", exchange.value, exchange.valid);
            if (exchange.value) {
                exchange.valid = true;
                return super.handleResponding(exchange);
            }
            return super.handleAsking(exchange);
        });
    }
}
