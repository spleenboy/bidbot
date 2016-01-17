"use strict";

// Queues up actions to be exectued in FIFO order with a delay
class Trickle {
    constructor() {
        this.queue = [];
        this.delay = 1000;
        this.timer = null;
    }

    add(method) {
        this.queue.push(method);
        !this.timer && this.run();
    }

    run() {
        if (!this.queue.length) {
            this.timer = null;
            return;
        }

        const next = this.queue.shift();
        next();

        this.timer = setTimeout(this.run.bind(this), this.delay);
    }
}

module.exports = Trickle;
