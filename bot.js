"use strict";

const _ = require('lodash');
const config = require('./config/local.json');
const Models = require('./models');
const messages = require('./config/messages.json');

module.exports = class Bot {
    constructor(slack) {
        Models.sync()
        .then(() => {
            console.info("Models synced");
            if (slack) {
                this.connect(slack);
            }
        });
    }

    connect(slack) {
        this.slack = slack;

        slack.on('open', this.open.bind(this));
        slack.on('error', this.error.bind(this));
        slack.on('message', (original) => {
            try {
                this.message(original);
            } catch (e) {
                this.error(e, "Error processing message");
            }
        });
    }

    open() {
        console.log(`Connected to ${this.slack.team.name} as @${this.slack.self.name}`);
    }

    say(channel, key) {
        const value = messages[key];
        
        if (!_.isArray(value)) {
            channel.send(value);
            return;
        }

        const chosen = _.sample(value);

        if (!_.isArray(chosen)) {
            channel.send(chosen);
            return;
        }

        let delay = 0;
        chosen.forEach(msg => {
            setTimeout(channel.send.bind(channel, msg), delay);
            delay += config.pause;
        });
    }

    // Triggered when a post mentions the @bidbot
    startSale(msg) {
        console.log("Starting sale for message", msg);

        const search = {
            where: {
                postId: msg.id,
                sellerId: msg.user.id,
            },
        };

        // Find or create the item for sale based on the public post
        Models.Item.findOrCreate(search)
        .then((item, created) => {
            // Now send a DM to the seller
            this.slack.openDM(msg.user.id, (dm) => {
                const dmChannel = this.slack.getChannelGroupOrDMByID(dm.channel.id);
                this.say(dmChannel, "startSale");
            });
        });
    }

    // Could have either been triggered by a bid or a sale
    handleIM(msg) {
        msg.channel.send(`I got your private message, ${msg.user.profile.first_name}, but I'm kinda dumb right now. Check back later.`);
        return;
    }

    message(original) {
        const msg = new Models.SlackMessage(original, this.slack);

        if (msg.isIM()) {
            return this.handleIM(msg);
        }

        if (msg.isForMe()) {
            return this.startSale(msg);
        }
    }

    error(err, text) {
        console.error(text || 'Slack error', err);
    }
}
