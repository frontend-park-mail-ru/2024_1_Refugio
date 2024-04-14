import Birthday_Select from "../birthday-select/birthday-select.js";
import Gender_Select from "../gender-select/gender-select.js";

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
            birthday_select: new Birthday_Select(null, this.#config).render() ,
            gender_select: new Gender_Select(null, this.#config).render() ,

        };
        return template(signup_box);
    }
}
