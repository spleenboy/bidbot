"use strict";

module.exports = {
    "getBidAmount": [
        [(x) => `How much do you want to bid on _${x.topic.item.name}_?`]
    ],
    "bidBelowPrice": [
        [(x) => `Don't be cheap. That bid is below the asking price of _\$${x.topic.item.price}_`],
    ],
    "bidBelowHighBid": [
        [(x) => `Nope. That bid is below the current high bid of _\$${x.topic.item.highBid}_`],
    ],
    "bidReceived": [
        [(x) => `Awesome! I got your ${x.topic.bid.price > 0 ? '*$' + x.topic.bid.price + '*': ''} bid for _${x.topic.item.name}_`],
    ],
}
