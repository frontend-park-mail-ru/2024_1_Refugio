import Login from '../pages/login/login.js';

import BaseView from './base.js';


/**
 * Класс для рендера страницы логина
 * @class
 */
class LoginView extends BaseView {

    #config = {
        error: undefined
    }

    /**
         * Конструктор класса
         * @constructor
         */
    constructor() {
        super();
    }

    /**
     * Функция рендера страницы
     */
    renderPage(error = undefined) {
        this.#config.error = error;
        document.title = 'Вход';
        const page = new Login(this.root, this.#config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }
}

export default new LoginView();
