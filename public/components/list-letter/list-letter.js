/**
 * Класс обертки компонента
 * @class
 */
export default class List_letter {
    #parent
    #config

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
            img: this.#config.img,
            title: this.#config.title,
            text: this.#config.text,
        }
        return template(letter);
    }
}