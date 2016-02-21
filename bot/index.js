"use strict";

const _ = require('lodash');
const moment = require('moment');
const Slack = require('slack-client');
const Talker = require('slackversational');

const config = require('../config/local.json');
const messages = require('../config/messages');
const logger = require('../util/logger');
const load = require('./conversation');

const Models = require('../models');
const Winners = require('./winners');

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
        this.dispatcher = new Talker.Dispatcher();

        slack.on('open', this.open.bind(this));
        slack.on('error', this.error.bind(this));
        slack.on('message', this.dispatcher.messageHandler);

        this.dispatcher.exclude = (exchange) => !exchange.type === Talker.Exchange.DM;
        this.dispatcher.on('start', (conversation, exchange) => {
            conversation.on('say', (msg) => {
                this.slack.sendMessage(msg.text, msg.channel);
            });
            load(conversation, exchange);
        });

        slack.start();
    }


    error(err, text) {
        logger.error(text || 'Slack error', err);
    }


    open() {
        this.winners = new Winners(this.slack);
        this.winners.track();
        logger.info(`Connected to Slack`);
    }
}
