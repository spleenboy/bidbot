"use strict";

const _ = require('lodash');
const moment = require('moment');
const Slack = require('slack-client');
const Talker = require('slackversational');

const config = require('../config/local.json');
const messages = require('../config/messages');
const logger = require('../util/logger');
const conversations = require('./conversations');

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


    send(msg) {
        this.slack.sendMessage(msg.text, msg.channel);
    }


    connect(slack) {
        this.slack = slack;
        this.dispatcher = new Talker.Dispatcher();

        slack.on('open', this.open.bind(this));
        slack.on('error', this.error.bind(this));
        slack.on('message', this.dispatcher.messageHandler);

        this.dispatcher.exclude = conversations.exclude
        this.dispatcher.on('start', (conversation, exchange) => {
            conversation.on('say', this.send.bind(this));
            conversations.load(conversation, exchange);
        });

        slack.start();
    }


    error(err, text) {
        logger.error(text || 'Slack error', err);
    }


    open() {
        if (this.winners) {
            return;
        }

        this.winners = new Winners();
        this.winners.on('say', this.send.bind(this));
        this.winners.track();
        logger.info(`Connected to Slack`);
    }
}
