"use strict";

const Slack = require('slack-client');
const config = require('./config/local.json');
const Bot = require('./bot');

const slack = new Slack(config.slackToken, true, true);
const bot = new Bot(slack);

slack.login();
