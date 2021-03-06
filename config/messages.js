"use strict";

const moment = require('moment');

const Messages = {
    "greeting": [
        ["Hello!"],
        ["Howdy"],
        [":derp::derp::derp:"],
        ["What's up, home skillet?"],
        ["Hey is for :horse:"],
        ["Hello, moneybags."],
        ["..."],
    ],
    "okay": [
        ["Okay!"],
        ["Sure."],
        ["Sounds good."],
        [":moneybag:"],
        ["Fine"],
    ],
    "confused": [
        ["I don't get you."],
        ["You", "are", "silly. :stuck_out_tongue:"],
        ["You talk funny."],
        ["Huh?"],
        ["I think you're intentionally trying to confuse me."],
        ["Whatchutalkinbout?"],
        ["You think you're better than me?"],
        ["Beep. Boop. Beep", "Does not compute. :computer:"],
    ],
    "abandoned": [
        ["Whatever you're trying to do: I want none of it."],
        ["Pbbbl. Whatever. :stuck_out_tongue_winking_eye:"],
        ["Let's pretend this never happened."],
    ],
    "error": [
        [(err) => `Something just went horribly wrong. \`${err}\``],
    ],
    "getAction": [
        ["Would you like to bid on something, auction something, or raffle something?"],
        ["bid, auction, or raffle?"],
        ["You again? What do you want? (bid, auction, or raffle)"],
    ],

    // Bidding
    "getBidItem": [
        ["What do you want to bid on?"]
    ],
    "bidItemNotFound": [
        ["I can't find what you're looking for. Please use the `ID` I made up for the item."]
    ],
    "bidItemFoundMany": [
        ["I found more than one item with that id. What are the odds?"]
    ],
    "getBidPrice": [
        [(item) => `How much do you want to bid on _${item.name}_?`]
    ],
    "bidReceived": [
        [(bid) => `Awesome! I got your ${bid.price > 0 ? '$' + bid.price : ''} bid for _${bid.item.name}_`],
    ],
    "bidReceivedAlready": [
        [(bid) => `You've already bid on _${bid.item.name}_.`, "It's a raffle. One bid per person.", "Cheater."],
        [(bid) => `You've already bid on _${bid.item.name}_.`, ":poop::poop::poop:"],
    ],
    "bidTooLow": [
        ["Cheapskate!", (item) => `That's below the current high bid of \$${item.highBid}.`],
    ],
    "itemsForBid": [
        ["Here are the things I know about", (items) => {
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
        }],
    ],
    "noItemsForBid": [
        ["I feel so worthless.", "There's nothing to bid on."],
        ["I am empty inside. There is nothing to bid on."],
        ["If a tree falls in the woods and nobody is there to hear it...", "Ah, whatever. I got nothing."],
        ["I hate to break it to you, but no one has anything up for bid."],
        ["This sucks. There's nothing available."],
        ["Are you ready?", "For disappointment?", "Because there's nothing up for bid."],
    ],


    // Auctions and raffles
    "getItemName": [
        [(ctx) => `What do you want to call your ${ctx.type}?`]
    ],
    "getItemDescription": [
        [(ctx) => `Please describe _${ctx.name}_.`]
    ],
    "getItemPrice": [
        [(item) => {
            if (item.type === "raffle") {
                return "How much do you want to for it?"
            } else {
                return "What is your starting price?";
            }
        }]
    ],
    "getItemEndsOn": [
        [(ctx) => `How long would you like the ${ctx.type} to last?`] 
    ],
    "getItemChannel": [
        [(ctx) => `In which channel would you like to post this ${ctx.type}?`]
    ],
    "confirmItemSale": [
        [(item) => {
            const what = item.type === 'auction' ? 'an auction' : 'a raffle';

            let price = "";
            if (item.price) {
                price = item.type === 'auction'
                        ? ` Starting bid is *\$${item.price}*.\n`
                        : ` Price is *\$${item.price}*.\n`;
            }
            return `Here's basically what I want to post\n
>>> @${item.seller.name} is holding ${what} for *${item.name}*\n
${item.description}\n
${price}
The ${item.type} ends ${item.deadline}.`
        }, "Should I do it?"]
    ],
    "itemSaleConfirmed": [
        ["It's up!"]
    ],
    "itemSaleCanceled": [
        ["All that work for nothing?", (item) => `Okay. Fine. I canceled the ${item.type}.`],
    ],
    "itemPost": [
        [(item) => {
            const what = item.type === 'auction' ? 'an auction' : 'a raffle';
            return `<@${item.sellerId}> is holding ${what} for *${item.name}*\n
> ${item.description}\n
The ${item.type} ends ${item.deadline}. Act fast! DM me if you want to bid.`;
        }],
    ],


    // Winners
    "raffleWon": [
        [(item) => `<@${item.sellerId}>'s raffle for _${item.name}_ is over and <@${item.winner.buyerId}> won! Winner winner :chicken: dinner.`],
    ],
    "raffleLost": [
        [(item) => `<@${item.sellerId}>'s raffle for _${item.name}_ is done, but nobody wanted it. :crickets:`],
    ],
    "auctionWon": [
        [(item) => `<@${item.sellerId}>'s raffle for _${item.name}_ is over and <@${item.winner.buyerId}> won with a bid of \$${item.winner.price}. :dollar:`],
    ],
    "auctionLost": [
        [(item) => `<@${item.sellerId}>'s auction for _${item.name}_ is done, but nobody wanted it. :cry:`],
    ],
};

module.exports = Messages;
