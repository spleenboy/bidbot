"use strict";

const Validator = require('slackversational').Validators.Validator;

module.exports = class OneBidItem extends Validator {
    validate(value) {
        if (value && value.length === 1) {
            return true;
        }

        if (!value || !value.length) {
            this.messages = [
                ["I can't find what you're looking for. Please use the `ID` I made up for the item."],
            ];
        } else if (value.length > 1) {
            this.messages = [
                ["I found more than one item that matches the `ID` you used.", "I'm not capable of handling the stress. Sorry!"],
            ];
        }
        return false;
    }
}
