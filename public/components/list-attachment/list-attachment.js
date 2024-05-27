import template from './list-attachment.hbs'
/**
 * Класс обертки компонента
 * @class
 */
export default class List_attachment {
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
        const attachment = {
            id: this.#config.id,
            name : this.#config.name,
            size : this.#config.size,
            
        };
        return template(attachment);
    }


    addListeners() {
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
    }
}