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
        const template = Handlebars.templates['list-letter.hbs'];
        const letter = {
            status: this.#config.status,
            avatar: this.#config.avatar,
            from: this.#config.from,
            subject: this.#config.subject,
            text: this.#config.text,
            date: this.#config.date,
        };
        return template(letter);
    }
}