import {template} from './login-box.hbs'
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
        const login_box = {
        };
        return template(login_box);
    }
}
