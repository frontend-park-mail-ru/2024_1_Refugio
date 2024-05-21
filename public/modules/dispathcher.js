import handlers from '../config/handlers.js'

/**
 * Класс диспетчера
 * @class
 */
class Dispatcher {
    #handlers;

    /**
     * Конструктор класса
     * @constructor
     */
    constructor() {
        this.#handlers = new Map();
        handlers.forEach((handler) => {
            this.#handlers.set(handler.type, handler.method);
        })
    }

    /**
     * Функция обработки экшенов
     */
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