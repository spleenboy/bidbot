"use strict";

const Validator = require('slackversational').Validators.Validator;

module.exports = class Abandoned extends Validator {
    constructor(messages) {
        super(messages);
        if (!messages) {
            this.messages = [
                ["Okaythanxbye"],
                ["Whatever. :eye_roll:"],
                ["Later alligator"],
            ];
        }
    }

    apply(exchange) {
        const done = /^(nm|nevermind|never mind|cancel|stop|abort)$/i.test(exchange.input.text);
        if (done) {
            exchange.write(this.messages);
            exchange.ended = true;
        }
        return exchange;
    }
}
