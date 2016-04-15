"use strict";

module.exports = {
    "getItemQuantity": [
        ["How many do you have up for grabs?"],
        ["How many?"],
        ["Quantity please?"],
    ],
    "gotItemQuantity": [
        [(x) => `I'll pretend you said *${x.topic.item.quantity}*`],
        [(x) => `${x.topic.item.quantity} *${x.topic.item.name}!*`],
        [(x) => `1 fish, 2 fish. *${x.topic.item.quantity} ${x.topic.item.name}!*, blue fish.`],
    ],
};
