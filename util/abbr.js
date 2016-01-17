"use strict";

const _ = require('lodash');

module.exports = class Abbr {
    constructor(seed) {
        this.seed = seed;
        this.maxNumbers = 3;
        this.maxInitials = 3;
        this.generate();
    }

    randomNumber() {
        const max = (10 * this.maxNumbers) - 1;
        const number = _.random(max);
        return _.padStart(number, this.maxNumbers, '0');
    }

    initials() {
        const letters = this.seed.match(/\b(\w)/g);
        const all = letters.join('');
        return all.toLowerCase().substr(0, this.maxInitials);
    }

    generate() {
        this._value = this.initials() + this.randomNumber();
    }

    get value() {
        if (!this._value) {
            this.generate();
        }
        return this._value;
    }

    toString() {
        return this.value;
    }
}
