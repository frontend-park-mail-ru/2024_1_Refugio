/**
 * Класс обертки компонента
 * @class
 */
export default class Header {
    #parent
    #config

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
        const template = Handlebars.templates['header.hbs'];
        const header = {
            logo: this.#config.logo,
            username: this.#config.username,
        }
        return template(header);
    }
}

