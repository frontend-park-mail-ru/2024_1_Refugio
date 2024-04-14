import Header from '../../components/header/header.js';
import Menu from '../../components/menu/menu.js';
import List_letters from '../../components/list-letters/list-letters.js';
import mediator from '../../modules/mediator.js';
import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionRedirect, actionRedirectToLetter } from '../../actions/userActions.js';
import  {template}  from './main.hbs'


/**
 * Класс обертки страницы
 * @class
 */
export default class Sent {
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
     * Рендер компонента в DOM
     */
    render() {
        this.#config.content.sent = true;
        const elements = {
            header: new Header(null, this.#config.header).render(),
            menu: new Menu(null, this.#config.menu).render(),
            list_letters: new List_letters(null, this.#config.content).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    handleDropdowns(e) {
        const target = e.target;

        const elements = {
            profile: {
                button: document.querySelector('.header__avatar'),
                dropdown: document.querySelector('.header__dropdown'),
            }
        }

        const hideAllDropdowns = () => {
            Object.values(elements).forEach(value => {
                value.dropdown.classList.remove('show');
            });
        }

        let hasTarget = false;
        Object.keys(elements).forEach(key => {
            if (elements[key].button.contains(target)) {
                hasTarget = true;
                let showDropdown = true;
                if (elements[key].dropdown.classList.contains('show')) {
                    showDropdown = false;
                }
                hideAllDropdowns();
                if (showDropdown) {
                    elements[key].dropdown.classList.add('show');
                }
            }
        })
        if (!hasTarget) {
            hideAllDropdowns();
        }
    };

    /**
     * Функция выхода из ящика
     */
    handleExit = async (e) => {
        e.preventDefault();
        await dispathcher.do(actionLogout());
    };

    handleProfile = (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/profile', true));
    };

    handleWriteLetter = (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/write_letter', true));
    };

    handleLetter = (e, id) => {
        e.preventDefault();
        dispathcher.do(actionRedirectToLetter(id, true));
    };

    handleMain = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/main', true));
    };

    handleSent = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/sent', true));
    };

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#parent
            .querySelectorAll('.list-letter').forEach((letter) => {
                letter.addEventListener('click', (e) => this.handleLetter(e, letter.dataset.id));
            });
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .addEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.header__dropdown__profile-button')
            .addEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('.menu__write-letter-button')
            .addEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('#incoming-folder')
            .addEventListener('click', this.handleMain);
        this.#parent
            .querySelector('#sent-folder')
            .addEventListener('click', this.handleSent);
        this.#parent.
            querySelector('.header__logo')
            .addEventListener('click', this.handleMain);
        this.#parent.addEventListener('click', this.handleDropdowns);
        mediator.on('logout', this.handleExitResponse)
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent
            .querySelectorAll('.list-letter').forEach((letter) => {
                letter.removeEventListener('click', (e) => this.handleLetter(e, letter.dataset.id));
            });
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .removeEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.header__dropdown__profile-button')
            .removeEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('.menu__write-letter-button')
            .removeEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('#incoming-folder')
            .removeEventListener('click', this.handleMain);
        this.#parent
            .querySelector('#sent-folder')
            .removeEventListener('click', this.handleSent);
        this.#parent.
            querySelector('.header__logo')
            .removeEventListener('click', this.handleMain);
        this.#parent.removeEventListener('click', this.handleDropdowns);
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