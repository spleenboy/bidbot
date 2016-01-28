"use strict";

module.exports = {
    "getBidAmount": [
        [(x) => `How much do you want to bid on _${x.item.name}_?`]
    ],
    "bidBelowPrice": [
        [(x) => `Don't be cheap. That bid is below the asking price of _\$${x.item.price}_`],
    ],
    "bidBelowHighBid": [
        [(x) => `Nope. That bid is below the current high bid of _\$${x.item.highBid}_`],
    ],
    "bidReceived": [
        [(x) => `Awesome! I got your ${x.bid.price > 0 ? '*$' + x.bid.price + '*': ''} bid for _${x.item.name}_`],
    ],
}
