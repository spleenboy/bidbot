"use strict";

module.exports = {
    "getItemName": [
        ["What do you want to call your auction?"],
        ["Gimme a name for this auction."],
    ],
    "gotItemName": [
        [(x) => `You're auctioning off *${x.topic.item.name}*? Cool.`],
        ["Got it."],
    ]
}
