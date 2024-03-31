import Login from '../pages/login/login.js';
import Profile from '../pages/profile/profile.js';

import BaseView from './base.js';

const config = {
};

/**
 * Класс для рендера страницы логина
 * @class
 */
export default class LoginView extends BaseView {
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
        this.clear();
        const page = new Profile(this.root, config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }


}