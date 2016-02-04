"use strict";

const moment = require('moment');

module.exports = {
    "getItemDeadline": [
        [(x) => `How long would you like the ${x.topic.item.type} to last?`] 
    ],
    "gotItemDeadline": [
        [(x) => {
            const done = moment(x.topic.item.endsOn).fromNow();
            return `I hope you mean ${done}.`;
        }]
    ],
};
