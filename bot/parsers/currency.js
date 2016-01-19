"use strict";

module.exports = class Currency extends Parser {
    parse(value) {
        if (this.hasAnyWord(value, ['free', 'nothing'])) {
            return 0;
        }
        const currency = /(\b[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?\b)/;
        const matches = currency.exec(value);
        return matches ? parseFloat(matches[0]) : null;
    }
}
