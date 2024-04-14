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
        Handlebars.templates['menu.hbs'];

        return template();
    }
}