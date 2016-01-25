"use strict";

const _ = require('lodash');
const moment = require('moment');
const config = require('../config/local.json');
const messages = require('../config/messages');
const logger = require('../util/logger');

const Models = require('../models');
const Winners = require('./winners');
const Requests = require('./requests/');

const Talker = require('slackversational');

module.exports = class Bot {
    constructor(slack) {
        Models.sync()
        .then(() => {
            logger.info("Models synced");
            if (slack) {
                this.connect(slack);
            }
        });
    }


    connect(slack) {
        this.slack = slack;
        slack.on('open', this.open.bind(this));
        slack.on('error', this.error.bind(this));

        const dispatcher = new Talker.Dispatcher(slack);

        dispatcher.exclude = (message) => {
            return !message.channel.is_im;
        };

        dispatcher.on('start', (conversation, msg) => {
            Models.Exchange.findOrCreate({
                where: {
                    userId: msg.input.user,
                    channelId: msg.input.channel,
                }
            }).then((exchange) => {

                const getAction = new Requests.GetAction();
                getAction.on('valid', (response) => {
                    const action = response.value;
                    const rqid = "start-" + action;
                    conversation.setRequest((rq) => rq.id === rqid);
                });
                conversation.addRequest(getAction);


                if (exchange.wanting) {
                    conversation.setRequest(rq => rq.name === exchange.wanting);
                }

                conversation.on('end', () => exchange.destroy());
                conversation.process(msg);
            });
        });

        dispatcher.listen(slack);
    }


    open() {
        this.winners = new Winners();
        this.winners.on('won', this.bidWon.bind(this));
        this.winners.track();
        logger.info(`Connected to ${this.slack.team.name} as @${this.slack.self.name}`);
    }


    error(err, text) {
        logger.error(text || 'Slack error', err);
    }
}
