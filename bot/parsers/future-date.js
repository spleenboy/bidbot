"use strict";

module.exports = class FutureDate extends Parser {
    parse(value) {
        const check = /((\d+) (second|minute|min|hour|day)s?)/gi;
        let date = moment();
        let matches = null;
        let any = false;
        while ((matches = check.exec(value)) !== null) {
            let number = parseInt(matches[2]);
            let unit = matches[3] + 's';
            if (!isNaN(number) && number > 0) {
                date.add(number, unit);
                any = true;
            }
        }
        return any ? date.toDate() : null;
    }
}
