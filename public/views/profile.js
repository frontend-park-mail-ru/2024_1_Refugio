import Profile from '../pages/profile/profile.js';
import BaseView from './base.js';
import ajax from '../modules/ajax.js';

/**
 * Класс для рендера страницы логина
 * @class
 */
export default class ProfileView extends BaseView {


    #config = {
        menu: {},
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
    async renderPage() {
        this.clear();
        const page = new Profile(this.root, this.#config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }

}