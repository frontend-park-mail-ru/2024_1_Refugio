import template from './vk-signup-box.hbs'

/**
 * Класс обертки компонента
 * @class
 */
export default class Vk_Signup_box {
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
     * рендерит компонент в DOM
     */
    render() {
        return template();
    }
}
