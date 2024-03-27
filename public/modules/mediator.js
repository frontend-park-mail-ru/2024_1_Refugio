class Mediator {
    #listeners

    constructor() {
        this.#listeners = {};
    }

    on(event, callback) {
        this.#listeners[event] = this.#listeners[event] || [];
        this.#listeners[event].push(callback);
    }

    off(event, callback) {
        if (event in this.#listeners) {
            if (this.#listeners[event].includes(callback)) {
                this.#listeners[event].splice(this.#listeners[event].indexOf(callback), 1);
            }
        }
    }

    emit(event, data) {
        this.#listeners[event].forEach((listener) => listener(data));
    }
}

export default new Mediator();