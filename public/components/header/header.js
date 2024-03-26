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
        const template = Handlebars.templates['header.hbs'];
        const header = {
            usernameLetter: this.#config.username.charAt(0),
            avatar: this.#config.avatar,
        };
        return template(header);
    }
}

