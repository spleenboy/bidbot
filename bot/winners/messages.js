"use strict";

module.exports = {
    "won": (ctx) => {
        const item = ctx.item;
        const bids = ctx.bids;
        const output = [
            `<@${item.sellerId}>'s ${item.type} for _${item.name}_ is done.`,
        ];
        bids.forEach(bid => {
            if (bid.price) {
                output.push(`<@${bid.buyerId}> won with a bid of *\$${bid.price}*`);
            } else {
                output.push(`<@${bid.buyerId}> won!`);
            }
        });
        output.push("Winner winner :chicken dinner.");
        return [output];
    },

    "lost": (ctx) => {
        const item = ctx.item;
        return [
            [`<@${item.sellerId}>'s ${item.type} for _${item.name}_ is done but nobody wanted it. :cry:`]
            [`<@${item.sellerId}>'s ${item.type} for _${item.name}_ ended in a fiery crash of nothing.`]
            [`Crash and burn! <@${item.sellerId}>'s ${item.type} for _${item.name}_ is done. No bids. Nothing. Nada.`]
        ];
    },
};