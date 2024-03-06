export default class Header {
    #parent
    #config

    constructor(parent, config) {
        this.#config=config;
        this.#parent=parent;
    }

    render() {
        const template = Handlebars.templates['header.hbs'];
        const header = {
            logo: this.#config.logo,
            username: this.#config.username,
        }
        return template(header);
    }
}

