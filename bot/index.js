"use strict";

const _ = require('lodash');
const moment = require('moment');
const Talker = require('slackversational');

const config = require('../config/local.json');
const messages = require('../config/messages');
const logger = require('../util/logger');
const conversation = require('./conversation');

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
        slack.on('open', this.open.bind(this));
        slack.on('error', this.error.bind(this));

        const dispatcher = new Talker.Dispatcher(slack);

        dispatcher.exclude = (message) => !message.channel.is_im;
        dispatcher.on('start', conversation.load);

        slack.login();
    }


    error(err, text) {
        logger.error(text || 'Slack error', err);
    }


    open() {
        this.winners = new Winners();
        this.winners.on('won', this.bidWon.bind(this));
        this.winners.track();
        logger.info(`Connected to ${this.slack.team.name} as @${this.slack.self.name}`);
    }


    bidWon(item, bid) {
        item.winner = bid;
        logger.info("Winner winner", item);
        let state = bid ? item.type + "Won" : item.type + "Lost";
    }
}
