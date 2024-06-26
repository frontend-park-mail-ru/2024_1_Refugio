import List_letter from '../../components/list-letter/list-letter.js';
import template from './list-letters.hbs'

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
                sent: this.#config.sent,
                status: letter.readStatus,
                avatar: letter.photoId,
                from: letter.senderEmail,
                to: letter.recipientEmail,
                subject: letter.topic,
                text: letter.text,
                date: letter.dateOfDispatch,
                id: letter.id,
            }).render(),);
        });
        return result;
    }

    /**
     * рендерит компонент в DOM
     */
    render() {
        const list_letters = this.#renderConfig(this.#config?.list_letters ? this.#config.list_letters : []);
        return template({ list_letters });
    }
}