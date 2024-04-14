/**
 * Класс обертки компонента
 * @class
 */
export default class Login_box {
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
        Handlebars.templates['login-box.hbs'];

        const login_box = {
        };
        return template(login_box);
    }
}
