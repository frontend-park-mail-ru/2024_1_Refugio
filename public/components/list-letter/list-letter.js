export default class List_letter {
    #parent
    #config

    constructor(parent, config) {
        this.#config=config;
        this.#parent=parent;
    }

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