import template from './header.hbs'
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
        const header = {
            avatar: this.#config.avatar,
            userLetter: this.#config.username.charAt(0),
            login: this.#config.login,
        };
        return template(header);
    }
}

