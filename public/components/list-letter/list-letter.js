import template from './list-letter.hbs'
/**
 * Класс обертки компонента
 * @class
 */
export default class List_letter {
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
        const letter = {
            status: !this.#config.status,
            avatar: this.#config.avatar,
            from: this.#config.from,
            subject: this.#config.subject,
            text: this.#config.text,
            date: new Date(this.#config.date).toDateString(),
            id: this.#config.id,
            userLetter: this.#config.from.charAt(0),
        };
        if (this.#config.sent) {
            letter.from = this.#config.to;
            letter.userLetter = this.#config.to.charAt(0);
        }
        return template(letter);
    }


    addListeners() {
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
    }
}