export default class Menu {
    #parent
    #config

    constructor(parent, config) {
        this.#config=config;
        this.#parent=parent;
    }

    render() {
        const template = Handlebars.templates['menu.hbs'];

        this.#parent.insertAdjacentHTML('afterbegin', template());
    }
}