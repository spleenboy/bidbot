"use strict";

const moment = require('moment');

module.exports = class SlackMessage {
    constructor(message, slack) {
        Object.assign(this, message);
        this.channel = slack.getChannelGroupOrDMByID(message.channel);
        this.user = slack.getUserByID(message.user);
        this.slack = slack;

        this.intent = null;
        this.subject = null;
        this.object = null;
    }


    hasWord(word) {
        const search = new RegExp(`(\b|^)${word}(\b|$)`, 'i');
        const matches = search.test(this.text);
        console.log(matches, 'testing', this.text, 'against', search);
        return matches
    }


    hasAnyWord(words) {
        return words.some(this.hasWord.bind(this));
    }


    hasBid() {
        return this.hasAnyWord(['bid', 'buy', 'offer', 'list']);
    }


    getPrice() {
        if (this.hasAnyWord(['free', 'nothing'])) {
            return 0;
        }
        const currency = /(\b[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?\b)/;
        const matches = currency.exec(this.text);
        return matches ? parseFloat(matches[0]) : false;
    }


    getDate() {
        const check = /((\d+) (second|minute|min|hour|day)s?)/gi;
        let date = moment();
        let matches = null;
        while ((matches = check.exec(this.text)) !== null) {
            let number = parseInt(matches[2]);
            let unit = matches[3] + 's';
            if (!isNaN(number) && number > 0) {
                date.add(number, unit);
            }
        }
        return date.toDate();
    }


    hasConfirmation() {
        return this.hasAnyWord(['yes','yeah', 'yup', 'ok', 'sure', 'fine', 'right', 'correct']);
    }


    hasDenial() {
        return this.hasAnyWord(['no', 'cancel', 'neither', 'none', 'nevermind', 'nm', 'wrong']);
    }


    atMe() {
        return `<@${this.slack.self.id}>`;
    }

    isIM() {
        return this.channel.is_im;
    }

    isForMe() {
        return (this.text.indexOf(this.atMe()) >= 0);
    }
}
