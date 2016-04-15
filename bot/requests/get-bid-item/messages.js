"use strict";

const moment = require('moment');

module.exports = {
    "getBidItem": [
        ["What do you want to bid on? _(Say `nm` to cancel)_"]
    ],
    "bidItemNotFound": [
        ["I can't find what you're looking for. Please use the `ID` I made up for the item or say `nm` to cancel."]
    ],
    "bidItemFoundMany": [
        ["I found more than one item with that id. What are the odds? Pretty dang slim."],
    ],
    "bidReceived": [
        [(x) => `Awesome! I got your bid for _${x.topic.item.name}_`],
    ],
    "bidReceivedAlready": [
        [(x) => `You've already bid on _${x.topic.item.name}_.`, "It's a raffle. One bid per person.", "Cheater."],
        [(x) => `You've already bid on _${x.topic.item.name}_.`, ":poop::poop::poop:"],
    ],
    "itemsForBid": [
        ["Here are the things I know about", (x) => {
            const items = x.items;
            const list = [];
            items.forEach((item, i) => {
                const deadline = moment(item.endsOn).fromNow();
                if (item.type === 'auction') {
                    const highbid = item.highBid ? ` Current high bid is \$${item.highBid}.` : ` Starting bid is \$${item.price}.`;
                    list.push(` • \`${item.abbr}\`: _${item.name}_ is an auction ending ${deadline}.${highbid}`);
                } else {
                    const price = item.price ? ` Price: *\$${item.price}*.` : ` *FREE!*`;
                    list.push(` • \`${item.abbr}\`: _${item.name}_ is a raffle ending ${deadline}. ${price}`);
                }
            });
            return list.join("\n");
        }],
    ],
    "noItemsForBid": [
        ["I feel so worthless.", "There's nothing to bid on."],
        ["I am empty inside. There is nothing to bid on."],
        ["If a tree falls in the woods and nobody is there to hear it...", "Ah, whatever. I got nothing."],
        ["I hate to break it to you, but no one has anything up for bid."],
        ["This sucks. There's nothing available."],
        ["Are you ready?", "For disappointment?", "Because there's nothing up for bid."],
        ["Well that's awkward.", "Nothing is up for bidding right now."],
    ],
};
