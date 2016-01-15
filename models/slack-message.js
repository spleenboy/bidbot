"use strict";

module.exports = class SlackMessage {
    constructor(message, slack) {
        Object.assign(this, message);
        this.channel = slack.getChannelGroupOrDMByID(message.channel);
        this.user = slack.getUserByID(message.user);
        this.slack = slack;
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
