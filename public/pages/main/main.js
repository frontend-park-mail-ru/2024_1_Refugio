import Header from '../../components/header/header.js';
import Menu from '../../components/menu/menu.js';
import List_letters from '../../components/list-letters/list-letters.js';
import mediator from '../../modules/mediator.js';
import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionRedirect } from '../../actions/userActions.js';

/**
 * Класс обертки страницы
 * @class
 */
export default class Main {
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
        const template = Handlebars.templates['main.hbs'];
        const config = this.#config;
        const elements = {
            header: new Header(null, config.header).render(),
            menu: new Menu(null, config.menu).render(),
            list_letters: new List_letters(null, config.content).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    /**
     * Функция выхода из ящика
     */
    handleExit = async (e) => {
        e.preventDefault();
        await dispathcher.do(actionLogout());
    };

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#parent
            .querySelector('.header__exit')
            .addEventListener('click', this.handleExit);
        mediator.on('logout', this.handleExitResponse)
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent
            .querySelector('.header__exit')
            .removeEventListener('click', this.handleExit);
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