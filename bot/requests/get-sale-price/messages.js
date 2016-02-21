"use strict";

module.exports = {
    "getItemPrice": [
        [(x) => {
            const item = x.topic.item;
            if (item.type === 'raffle') {
                return "How much do you want for it?";
            } else {
                return "What is the starting bid?";
            }
        }],
    ],
    "gotItemPrice": [],
};
