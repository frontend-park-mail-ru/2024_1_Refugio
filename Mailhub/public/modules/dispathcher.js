import '../config/handlers.js'

class Dispatcher {
    #handlers;

    constructor() {
        this.#handlers = new Map();
        handlers.forEach((handler) => {
            this.#handlers.set(handler.type, handler.method);
        })
    }

    async do(action) {
        const func = this.#handlers.get(action.type);
        if (func) {
            if (Object.prototype.hasOwnProperty.call(action, 'value')) {
                await func(action.value);
            } 
            else {
                await func();
            }
        }
    }
}

export default new Dispatcher();