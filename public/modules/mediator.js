/**
 * Класс медиатора
 * @class
 */
class Mediator {
    #listeners

    /**
     * Конструктор класса
     * @constructor
     */
    constructor() {
        this.#listeners = {};
    }

    /**
     * Функция подписки на событие
     */
    on(event, callback) {
        this.#listeners[event] = this.#listeners[event] || [];
        this.#listeners[event].push(callback);
    }

    /**
     * Функция отписки от события
     */
    off(event, callback) {
        if (event in this.#listeners) {
            if (this.#listeners[event].includes(callback)) {
                this.#listeners[event].splice(this.#listeners[event].indexOf(callback), 1);
            }
        }
    }

    /**
     * Функция отправки сигнала на срабатывание события
     */
    emit(event, data) {
        this.#listeners[event].forEach((listener) => listener(data));
    }
}

export default new Mediator();