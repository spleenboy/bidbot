"use strict";

const Validator = require('slackversational/validators/validator');

module.exports = class Confused extends Validator {
    constructor(messages) {
        this.messages = messages || [
            ["I don't get you."],
            ["You", "are", "silly. :stuck_out_tongue:"],
            ["You talk funny."],
            ["Huh?"],
            ["I think you're intentionally trying to confuse me."],
            ["Whatchutalkinbout?"],
            ["You think you're better than me?"],
            ["Beep. Boop. Beep", "Does not compute. :computer:"],
        ];
    }

    validate(value) {
        return !!value;
    }
}
