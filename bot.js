"use strict";

module.exports.error = function error(err) {
    console.error('Error', err);
}

class Bot {
    constructor(slack = null) {
        if (slack) this.connect(slack);
    }

    connect(slack) {
        this.slack = slack;

        slack.on('open', this.attempt('open'));
        slack.on('message', this.attempt('message'));
        slack.on('error', this.error.bind(this));
    }

    // Returns an error-handled, context-bound method
    attempt(method) {
        return (...args) => {
            try {
                this[method].call(this, args);
            } catch (e) {
                this.error(e);
            }
        };
    }

    open() {
        console.log(`Connected to ${this.slack.team.name} as @${this.slack.self.name}`);
    }

    message(msg) {
        const channel = this.slack.getChannelGroupOrDMByID(msg.channel);
        if (!msg.channel.is_im) {
            console.info("Message wasn't an IM. Ignoring", msg.text);
            return;
        }

        const user = this.slack.getUserByID(msg.user);
        channel.send(`I got your message, ${user.profile.first_name}, but I'm kinda dumb right now. Check back later.`);
    }

    error(err) {
        console.error('Error', err);
    }
}

module.exports = Bot;
