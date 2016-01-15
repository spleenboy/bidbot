const Messages = {
    "greeting": [
        ["Hello!"],
        ["Howdy"],
        [":derp:"]
    ],
    "okay": [
        ["Okay!"],
        ["Sure."],
        ["Sounds good."],
        [":moneybag:"],
    ],
    "confused": [
        ["I don't get you."],
        ["You talk funny."],
        ["Huh?"],
        ["I think you're intentionally trying to confuse me."],
    ],
    "abandoned": [
        ["Whatever you're trying to do: I want none of it."],
    ],
    "error": [
        [(err) => `Something just went horribly wrong. \`${err}\``],
    ],
    "getAction": [
        ["Would you like to bid on something, auction something, or raffle something?"]
    ],

    // Bidding
    "getBidItem": [
        ["What do you want to bid on?"]
    ],
    "bidItemNotFound": [
        ["I can't find what you're looking for. Please use the name of the item."]
    ],
    "bidItemFoundMany": [
        ["I found more than one item with that name. Please be more specific."]
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
        ["Cheapskate!", (bid) => `That's below the current high bid of \$${bid.price}.`],
    ],
    "itemsForBid": [
        ["Okay. Here are the things I know about"],
    ],
    "noItemsForBid": [
        ["I feel so worthless.", "There's nothing to bid on."]
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
            return `Here's basically what I want to post\n
> @${item.seller.name} is holding ${what} for *${item.name}*\n
> ${item.description}\n
> The ${item.type} ends ${item.deadline}.\n
Should I do it?`;
        }]
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
            return `@${item.seller.name} is holding ${what} for *${item.name}*\n
> ${item.description}\n
The ${item.type} ends ${item.deadline}. Act fast! DM if you want to bid.`;
        }],
    ],


    // Winners
    "raffleWon": [
        [(item) => `@${item.seller.name}'s raffle for _${item.name}_ is over and @${item.winner.buyer.name} won! Winner winner :chicken: dinner.`],
    ],
    "raffleLost": [
        [(item) => `@${item.seller.name}'s raffle for _${item.name}_ is done, but nobody wanted it. :cricket:`],
    ],
    "auctionWon": [
        [(item) => `@${item.seller.name}'s raffle for _${item.name}_ is over and @${item.winner.buyer.name} won with a bid of \$${item.winner.price}. :dollar:`],
    ],
    "auctionLost": [
        [(item) => `@${item.seller.name}'s auction for _${item.name}_ is done, but nobody wanted it. :cry:`],
    ],
};

module.exports = Messages;
