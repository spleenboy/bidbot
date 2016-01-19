"use strict";

module.exports = class Parser {
    parse(value) {
        return value;
    }

    apply(response, context) {
        response.value = this.parse(response.value);
    }


    hasWord(text, word) {
        const search = new RegExp(`(\b|^)${word}(\b|$)`, 'i');
        const matches = search.test(text);
        return matches
    }


    hasAnyWord(text, words) {
        return words.some(this.hasWord.bind(this, text));
    }
}
