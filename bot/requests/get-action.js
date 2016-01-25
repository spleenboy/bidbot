"use strict";

const Talker = require('slackversational');
const ParseAction = require('../parsers/action');
const Confused = require('../validators/confused');

module.exports = class GetAction extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "get-action";
        this.questions = [
            ["Would you like to bid on something, auction something, or raffle something?"],
            ["bid, auction, or raffle?"],
            ["You again? What do you want? (bid, auction, or raffle)"],
        ];
        this.processors = [
            new ParseAction(),
            new Confused()
        ];
        this.responses = [];
    }
}
