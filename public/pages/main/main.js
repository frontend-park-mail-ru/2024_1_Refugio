import Header from '../../components/header/header.js';
import Menu from '../../components/menu/menu.js';
import List_letters from '../../components/list-letters/list-letters.js';
import ajax from '../../modules/ajax.js';
import LoginView from '../../views/login.js';
import MainView from '../../views/main.js';

export default class Main {
    #parent
    #config

    constructor(parent, config) {
        this.#config = config;
        this.#parent = parent;
    }

    render() {
        const template = Handlebars.templates['main.hbs'];
        const config = this.#config;
        const elements = {
            header: new Header(null, config.header).render(),
            menu: new Menu(null, config.menu).render(),
            list_letters: new List_letters(null, config.content).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    addListeners() {
        this.#parent
            .querySelector('.header__exit')
            .addEventListener('click', (e) => {
                (async () => {
                    const response = await ajax(
                        'POST', 'http://89.208.223.140:8080/api/v1/logout', null, 'application/json'
                    );
                    const status = response.status;
                    const data = await response.json();
                    if (status < 300) {
                        const login = new LoginView();
                        login.renderPage();
                    } else {
                        const main = new MainView();
                        main.renderPage();
                    };
                })()
            })
    }

    removeListeners() {
        this.#parent
            .querySelector('.header__exit')
            .removeEventListener('click', (e) => {
                (async () => {
                    const response = await ajax(
                        'POST', 'http://89.208.223.140:8080/api/v1/logout', null, 'application/json'
                    );
                    const status = response.status;
                    const data = await response.json();
                    if (status > 300) {
                        const login = new LoginView();
                        login.renderPage();
                    } else {
                        const main = new MainView();
                        main.renderPage();
                    };
                })()
            })
    }
}