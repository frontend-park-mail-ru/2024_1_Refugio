import template from './survey.hbs'

/**
 * Класс обертки страницы
 * @class
 */
export default class Survey {
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
 
}
