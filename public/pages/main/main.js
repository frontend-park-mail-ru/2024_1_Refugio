import Header from '../../components/header/header.js';
import Menu from '../../components/menu/menu.js';
import List_letters from '../../components/list-letters/list-letters.js';

export default class Main {
    #parent
    #config

    constructor(parent, config) {
        this.#config=config;
        this.#parent=parent;
    }

    render() {
        const template = Handlebars.templates['main.hbs'];
        const elements = {
            header: new Header(null, this.#config.header).render(),
            menu: new Menu(null, this.#config.menu).render(),
            list_letters: new List_letters(null, this.#config.content).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }
}