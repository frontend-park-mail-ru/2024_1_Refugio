/**
 * Класс обертки компонента
 * @class
 */
export default class Signup_box {
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
        const template = Handlebars.templates['signup-box.hbs'];

        const signup_box = {
        };
        return template(signup_box);
    }
}
