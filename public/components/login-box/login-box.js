export default class Login_box {
    #parent
    #config

    constructor(parent, config) {
        this.#config=config;
        this.#parent=parent;
    }

    render() {
        const template = Handlebars.templates['login-box.hbs'];
        const header = {
            logo: this.#config.logo,
        }
        return template(login-box);
    }
}
