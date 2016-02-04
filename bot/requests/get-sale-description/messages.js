"use strict";

module.exports = {
    "getItemDescription": [
        [(x) => `Please describe _${x.topic.item.name}_ for the audience.`],
        [(x) => `Describe _${x.topic.item.name}_.`],
    ],
    "gotItemDescription": [
        [(x) => {
            if (x.topic.item.description.length > 255) {
                return "You're a bit wordy, aren't you?";
            } else {
                return "Nice, short, succinct. I like it.";
            }
        }]
    ],
};
