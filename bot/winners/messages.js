"use strict";

const _ = require('lodash');

module.exports = {
    "won": (ctx) => {
        const item = ctx.item;
        const bids = ctx.bids;
        const output = [
            `<@${item.sellerId}>'s ${item.type} for _${item.name}_ is done.\n`,
        ];
        bids.forEach(bid => {
            if (bid.price) {
                output.push(` • <@${bid.buyerId}> won with a bid of *\$${bid.price}*`);
            } else {
                output.push(` • <@${bid.buyerId}> won!`);
            }
        });
        return [
            [_.concat(output, "\nWinner, winner, :chicken: dinner.").join('\n')],
            [_.concat(output, `\nCongratulations on an exciting ${item.type}`).join('\n')],
            [_.concat(output, `\nWow. Just wow.`).join('\n')],
            [_.concat(output, "\nTrust me. I'm a bot.").join('\n')],
            [_.concat(output, "\nI hope you're all happy.").join('\n')],
        ];
    },

    "lost": (ctx) => {
        const item = ctx.item;
        return [
            [`<@${item.sellerId}>'s ${item.type} for _${item.name}_ is done but nobody wanted it. :cry:`],
            [`<@${item.sellerId}>'s ${item.type} for _${item.name}_ ended in a fiery crash of nothing.`],
            [`Crash and burn! <@${item.sellerId}>'s ${item.type} for _${item.name}_ is done. No bids. Nothing. Nada.`],
        ];
    },
};
