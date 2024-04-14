import {template} from './gender-select.hbs'

/**
 * Класс обертки компонента
 * @class
 */
export default class Gender_Select {
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
            gender: this.#config.user?.gender === 'Female' ? false : true,
        }
        return template(elements);
    }
}