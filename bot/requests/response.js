"use strict";

const _ = require('lodash');

module.exports = class Response {
    constructor(input) {
        // The original input
        this.input = input;

        // The parsed value culled from the input
        this.value = input;

        // Whether the input was valid
        this.valid = true;

        // The statements to use as a response
        this.output = [];
    }


    say(pool, context) {
        const choice = _.sample(pool);
        const statements = _.isArray(choice) ? question : [choice];
        const values = statements.map((statement) => {
            return _.isFunction(statement) ? statement(context) : statement;
        });
        if (values) {
            this.output = this.output.concat(values);
        }
    }
}
