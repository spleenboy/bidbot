"use strict";

const Required = require('slackversational').Validators.Required;

module.exports = class Confused extends Required {
    constructor(messages) {
        super(messages);
        if (!messages) {
            this.messages = [
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
    }
}
