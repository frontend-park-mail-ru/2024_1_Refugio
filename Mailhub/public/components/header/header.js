/**
 * Класс обертки компонента
 * @class
 */
export default class Header {
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
        Handlebars.templates['header.hbs'];
        const header = {
            avatar: this.#config.avatar,
            userLetter: this.#config.username.charAt(0),
        };
        return template(header);
    }
}

