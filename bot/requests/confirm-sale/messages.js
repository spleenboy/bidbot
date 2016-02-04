"use strict";

const moment = require('moment');

module.exports = {
    "confirm": [
        [(x) => {
            const item = x.topic.item;
            const what = item.type === 'auction' ? 'an auction' : 'a raffle';
            const deadline = moment(item.endsOn).fromNow();

            let price = "";
            if (item.price) {
                price = item.type === 'auction'
                        ? ` Starting bid is *\$${item.price}*.\n`
                        : ` Price is *\$${item.price}*.\n`;
            }
            return `Here's basically what I want to post in <#${item.channelId}>\n
>>> <@${item.sellerId}> is holding ${what} for *${item.name}*\n
${item.description}\n
${price}
The ${item.type} ends ${deadline}.`
        }, "Should I do it?"]
    ],

    "confused": [
        ["Don't get fancy.", "A simple `yes` or `no` will do."],
        ["C'mon. Yes or No?"],
    ],

    "confirmed": [
        ["It's up!"],
        [(x) => `Pop goes the ${x.topic.item.type}!`],
    ],

    "cancelled": [
        ["All that work for nothing?", (x) => `Okay. Fine. I canceled the ${x.topic.item.type}.`],
        ["Your post is toast."]
    ],

    "post": [
        [(x) => {
            const item = x.topic.item;
            const what = item.type === 'auction' ? 'an auction' : 'a raffle';
            const deadline = moment(item.endsOn).fromNow();
            return `<@${item.sellerId}> is holding ${what} for *${item.name}*\n
> ${item.description}\n
The ${item.type} ends ${deadline}. Act fast! DM me if you want to bid.`;
        }],
    ],
};
