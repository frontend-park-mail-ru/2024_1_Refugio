import { actionRedirect, actionLogout } from '../../actions/userActions.js'
import dispathcher from '../../modules/dispathcher.js';
import template from './header.hbs'
import mediator from '../../modules/mediator.js';
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

    handleProfile = (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/profile', true));
    };

    handleExit = async (e) => {
        e.preventDefault();
        await dispathcher.do(actionLogout());
    };



    addListeners() {
        this.#parent
            .querySelector('.header__logo')
            .addEventListener('click', this.handleLogoButton);
        this.#parent
            .querySelector('.header__rollup-button')
            .addEventListener('click', this.handleRollUpMenu);
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .addEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.header__dropdown__profile-button')
            .addEventListener('click', this.handleProfile);
        mediator.on('logout', this.handleExitResponse)
    }

    removeListeners() {
        this.#parent
            .querySelector('.header__logo')
            .removeEventListener('click', this.handleLogoButton);
        this.#parent
            .querySelector('.header__rollup-button')
            .removeEventListener('click', this.handleRollUpMenu);
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .removeEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.header__dropdown__profile-button')
            .removeEventListener('click', this.handleProfile);
        mediator.off('logout', this.handleExitResponse)
    }

    handleExitResponse = (status) => {
        switch (status) {
            case 200:
                dispathcher.do(actionRedirect('/login', true));
                break;
            default:
                break;
        }
    }
}

