"use strict";

module.exports = {
    "getItemName": [
        ["What do you want to call your raffle?"],
        ["Gimme a name for this raffle thing."],
    ],
    "gotItemName": [
        [(x) => `You're raffling *${x.topic.item.name}*? That's weird.`],
        ["Okay. If that's what you want to call it."],
    ]
}
