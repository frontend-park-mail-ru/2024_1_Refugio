import Login from  '../pages/login/login.js';
import BaseView from './base.js';'./base.js';

const config = {
};

/**
 * Класс для рендера страницы логина
 * @class
 */
class LoginView extends BaseView {
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
    renderPage() {
        document.title = 'Вход';
        const page = new Login(this.root, config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }
}

export default new LoginView();
