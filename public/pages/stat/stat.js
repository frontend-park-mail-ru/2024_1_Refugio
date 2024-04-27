import template from './stat.hbs';

/**
 * Класс обертки страницы
 * @class
 */
export default class Stat {
    #parent;
    #config;

    /**
     * Конструктор класса
     * @constructor
     * @param {Element} parent
     * @param {object} config
     */
    constructor(parent, config) {
        this.#config = config;
        this.#parent = parent;
    }

    /**
     * Рендер компонента в DOM
     */
    render() {
        this.#parent.insertAdjacentHTML('beforeend', template());
    }

    addListeners() {
    };

    removeListeners() {

    };


}
