module.exports = {
    "greeting": [
        ["Hello!"],
        ["Howdy"],
        [":derp:"]
    ],
    "okay": [
        ["Okay!"],
        ["Sure."],
        ["Sounds good."],
        [":moneybag:"]
    ],
    "confused": [
        ["I don't get you."],
        ["You talk funny."],
        ["Huh?"]
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
    "getBidAmount": [
        ["How much do you want to bid?"]
    ],
    "bidTooLow": [
        ["Cheapskate!", "That's below the current high bid."],
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
        [(ctx) => `Please describe _${ctx.name}_ for your ${ctx.type}.`]
    ],
    "getItemPrice": [
        [(item) => {
            return 
                item.type === "raffle"
                ? "How much do you want to for it?"
                : "What is your starting price?";
        }]
    ],
    "getItemEndsOn": [
        [(ctx) => `How long would you like the ${ctx.type} to last?`] 
    ],
    "getItemChannel": [
        [(ctx) => `Where would you like to post this ${ctx.type}?`]
    ],
    "confirmItemSale": [
        ["Okay. I'll put up the post for you."]
    ],
};
