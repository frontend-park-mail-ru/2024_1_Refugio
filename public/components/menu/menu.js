import template from './menu.hbs'
/**
 * Класс обертки компонента
 * @class
 */
export default class Menu {
    #parent;
    #config;

    /**
     * Конструктор класса
     * @constructor
     * @param {Element} parent 
     * @param {object} config 
     */
    constructor(parent, config) {
        this.#config=config;
        this.#parent=parent;
    }

    /**
     * рендерит компонент в DOM
     */
    render() {

        return template();
    }
}