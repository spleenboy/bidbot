"use strict";

const Validator = require('./validator');

class RequiredValidator extends Validator {
    validate(response) {
        return response.value.length > 0;
    }
}
