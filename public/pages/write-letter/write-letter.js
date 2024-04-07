import ajax from '../../modules/ajax.js';
import LoginView from '../../views/login.js';
import Menu from '../../components/menu/menu.js';
import Header from '../../components/header/header.js';


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
     * Функция рендера страницы авторизации
     */
    renderLogin = async (e) => {

        e.preventDefault();

        const loginView = new LoginView();

        loginView.renderPage();
    };

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        
    }
}
