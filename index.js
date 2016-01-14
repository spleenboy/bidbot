import Slack from 'slack-client';

const config = require('config/local.json');

const slack = new Slack(config.slackToken, true, true);

slack.on('open', 
