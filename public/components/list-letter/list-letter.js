export default class List_letter {
    #parent
    #config

    constructor(parent, config) {
        this.#config=config;
        this.#parent=parent;
    }

    render() {
        const template = Handlebars.templates['list-letter.hbs'];

        this.#parent.insertAdjacentHTML('beforeend', template());
    }
}