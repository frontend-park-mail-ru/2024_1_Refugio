export default class Login_box {
    #parent
    #config

    constructor(parent, config) {
        this.#config=config;
        this.#parent=parent;
    }

    render() {
        const template = Handlebars.templates['login-box.hbs'];

        const login_box = {
        }
        return template(login_box);
    }
}
