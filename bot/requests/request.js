"use strict";

const _ = require('lodash');
const Response = require('./response');

module.exports = class Request {
    constructor(name) {
        this.name = name;

        // The questions to ask
        this.questions = [];

        // The confirmations of successful reads
        this.confirmations = [];

        // The parsers used to process a response's input
        this.processors = [];
    }

    // Returns an array of string statements, pulled randomly from
    // the available questions. This is usually step #1 in processing a request.
    ask(input, context) {
        const response = new Response(input);
        response.say(this.questions, context);
        return response;
    }

    // Reads and processes input. Returns a Response object.
    // Typically step #2, after a request has been asked.
    // This part of the request involves parsing and validating
    // the input through one or more processors.
    read(input, context) {
        const response = new Response(input);
        this.processors.forEach(process => {
            process.apply(response, context);
        });
        return response;
    }
}
