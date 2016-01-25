"use strict";

const Talker = require('slackversational');
const Models = require('./models/');
const ParseAction = require('../parsers/action');
const ItemByAbbr = require('../parsers/item-by-abbr');
const Confused = require('../validators/confused');

module.exports = class GetBidItem extends Talker.Request {
    constructor(id) {
        super(id);
        this.id = "get-bid-item";
        this.processors = [
            new ItemByAbbr(),
            new Confused("I can't find what you're looking for. Please use the `ID` I made up for the item.")
        ];
    }


    static get noItemsMessage() {
        return [
            ["I feel so worthless.", "There's nothing to bid on."],
            ["I am empty inside. There is nothing to bid on."],
            ["If a tree falls in the woods and nobody is there to hear it...", "Ah, whatever. I got nothing."],
            ["I hate to break it to you, but no one has anything up for bid."],
            ["This sucks. There's nothing available."],
            ["Are you ready?", "For disappointment?", "Because there's nothing up for bid."],
        ];
    }


    static get itemsForBidIntroMessage() {
        return "Here's what I know about:";
    }


    static get askForBidMessage() {
        return "What do you want to bid on?";
    }


    itemsForBidMessage(items) {
        const list = [];
        items.forEach((item, i) => {
            const deadline = moment(item.endsOn).fromNow();
            if (item.type === 'auction') {
                const highbid = item.highBid ? ` Current high bid is \$${item.highBid}.` : `Starting bid is \$${item.price}.`;
                list.push(` • \`${item.abbr}\`: _${item.name}_ is an auction ending ${deadline}.${highbid}`);
            } else {
                const price = item.price ? ` Price: *\$${item.price}*.` : ` *FREE!*`;
                list.push(` • \`${item.abbr}\`: _${item.name}_ is a raffle ending ${deadline}. ${price}`);
            }
        });
        return list.join("\n");
    }


    getQuestions(exchange) {
        Models.Item.findAll({
            where: {active: true},
            order: 'endsOn',
        })
        .then((items) => {
            if (!items || items.length === 0) {
                return this.noItemsMessage;
            } else {
                return [
                    this.itemsForBidIntroMessage,
                    this.itemsForBidMessage(items),
                    this.askForBidMessage
                ];
            }
        });
    }


    read(exchange) {

    }
}
