import Login_Box from '../../components/login-box/login-box.js';

export default class Login {
    #parent
    #config

    constructor(parent, config) {
        this.#config=config;
        this.#parent=parent;
    }

    render() {
        const template = Handlebars.templates['login.hbs'];
        const elements = {
            login_box: Login_Box(null, this.#config.login_box).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }
}