import { actionRedirect } from '../../actions/userActions.js'
import dispathcher from '../../modules/dispathcher.js';
import template from './header.hbs'
/**
 * Класс обертки компонента
 * @class
 */
export default class Header {
    #parent;
    #config;

    /**
     * Конструктор класса
     * @constructor
     * @param {Element} parent 
     * @param {object} config 
     */
    constructor(parent, config) {
        this.#config = config;
        this.#parent = parent;
    }

    /**
     * рендерит компонент в DOM
     */
    render() {
        const header = {
            avatar: this.#config.avatar,
            userLetter: this.#config.username.charAt(0),
            login: this.#config.login,
            title: document.title,
        };
        return template(header);
    }


    handleLogoButton = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/main', true));
    }

    handleRollUpMenu = (e) => {
        e.preventDefault();
        const menu = document.querySelector('.menu');
        if (menu.classList.contains('appear')) {
            menu.classList.remove('appear');
        } else {
            menu.classList.add('appear');
        }
    }



    addListeners() {
        this.#parent
            .querySelector('.header__logo')
            .addEventListener('click', this.handleLogoButton);
        this.#parent
            .querySelector('.header__rollup-button')
            .addEventListener('click', this.handleRollUpMenu);
    }

    removeListeners() {
        this.#parent
            .querySelector('.header__logo')
            .removeEventListener('click', this.handleLogoButton);
        this.#parent
            .querySelector('.header__rollup-button')
            .removeEventListener('click', this.handleRollUpMenu);
    }
}

