import Menu from '../../components/menu/menu.js';
import Header from '../../components/header/header.js';
import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionRedirect } from '../../actions/userActions.js';
import mediator from '../../modules/mediator.js';


const MAX_INPUT_LENGTH = 64;


/**
 * Класс обертки страницы
 * @class
 */
export default class Write__Letter {
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
        const template = Handlebars.templates['write-letter.hbs'];
        const config = this.#config;

        const elements = {
            header: new Header(null, config.header).render(),
            menu: new Menu(null, config.menu).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    /**
     * Функция авторизации
     */

    handleSaveForm = async (e) => {
        e.preventDefault();

    };

    /**
     * Функция вызова logout действия
     */
    handleExit = async (e) => {
        e.preventDefault();
        await dispathcher.do(actionLogout());
    };

    handleProfile = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/profile', true));
    };

    handleMain = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/main', true));
    };

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#parent
            .querySelector('.dropdown__profile-menu__logout__button')
            .addEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.dropdown__profile-menu__profile__button')
            .addEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('.menu__incoming__button')
            .addEventListener('click', this.handleMain);
        mediator.on('logout', this.handleExitResponse)
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent
            .querySelector('.dropdown__profile-menu__logout__button')
            .removeEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.dropdown__profile-menu__profile__button')
            .removeEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('.menu__incoming__button')
            .removeEventListener('click', this.handleMain);
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
