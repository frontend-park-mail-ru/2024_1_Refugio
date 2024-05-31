import template from './vk-signup-box.hbs'
import Gender_Select from "../gender-select/gender-select.js";
import Birthday_Select from "../birthday-select/birthday-select.js";


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
        const elements = {
            first_name: this.#config.vkUser.firstname,
            last_name: this.#config.vkUser.surname,
            birthday_select: new Birthday_Select(null, this.#config).render(),
            gender_select: new Gender_Select(null, this.#config).render(),

        };
        return template(elements);
    }
}
