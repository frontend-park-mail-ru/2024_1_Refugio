'use strict'

export default class Header {
    #parent
    #config

    constructor(parent, config) {
        this.#config=config;
        this.#parent=parent;
    }

    render() {
        const template = Handlebars.templates['header.hbs'];

        this.#parent.innerHTML = template();
    }
}

