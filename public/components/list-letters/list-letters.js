import List_letter from '../../components/list-letter/list-letter.js';
/**
 * Класс обертки компонента
 * @class
 */
export default class Main {
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
     * Функция, создающая массив компонетов для рендера
     * @param {Array<object>} letters письменное описание писем
     * @returns {Array} массив объектов класса писем
     */
    #renderConfig(letters) {
        const result = [];
        letters.forEach((letter) => {
            result.push(new List_letter(null, {
            
                status: letter.status,
                avatar: letter.photoId,
                from: letter.from,
                subject: letter.subject,
                text: letter.text,
                date: letter.date,
            }).render(),);
        });
        return result;
    }

    /**
     * рендерит компонент в DOM
     */
    render() {
        const template = Handlebars.templates['list-letters.hbs'];
        const list_letters = this.#renderConfig(this.#config?.list_letters ? this.#config.list_letters : []);
        return template({ list_letters });
    }
}