import template from './menu.hbs'
/**
 * Класс обертки компонента
 * @class
 */
export default class Menu {
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
        const elements = {
            incoming_count: this.#config.incoming_count,
            titleIncoming: (document.title==='Входящие' ? document.title: undefined),
            titleSent: (document.title==='Отправленные' ? document.title: undefined),
        };
        return template(elements);
    }
}