import Profile from '../pages/profile/profile.js';
import BaseView from './base.js';

/**
 * Класс для рендера страницы логина
 * @class
 */
class ProfileView extends BaseView {
    #config = {
        menu: {},
        header: {
            avatar: '',
        },
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
        document.title = 'Профиль';
        this.#config.header.avatar = await this.#getUserAvatar();
        const page = new Profile(this.root, this.#config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }

    /**
     * Запрашивает у сервера имя пользователя
     * @returns {string} имя пользователя
     */
    async #getUserAvatar() {
        // const response = await ajax(
        //     'GET', 'http://89.208.223.140:8080/api/v1/get-user', null, 'application/json'
        // );
        // const data = await response.json();
        // return data.body.user.name;
        return "avatar path";

    }

}

export default new ProfileView();