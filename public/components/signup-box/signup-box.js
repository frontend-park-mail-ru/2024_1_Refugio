export default class Signup_box {
    #parent
    #config

    constructor(parent, config) {
        this.#config=config;
        this.#parent=parent;
    }

    render() {
        const template = Handlebars.templates['signup-box.hbs'];

        const signup_box = {
        }
        return template(signup_box);
    }
}
