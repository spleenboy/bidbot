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
        },
        "_Enter a dollar amount like *3.50*, or you can say *free* or *nothing*_"
        ],
    ],
    "gotItemPrice": [],
};
