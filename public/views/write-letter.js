import BaseView from './base.js';
import Write__Letter from '../pages/write-letter/write-letter.js';
import userStore from '../stores/userStore.js';
import dispathcher from '../modules/dispathcher.js';
import { actionGetUser } from '../actions/userActions.js';

/**
 * Класс для рендера страницы логина
 * @class
 */
class WriteLetterView extends BaseView {
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
        document.title = 'Новое письмо';
        this.#config.user = await this.#getUserInfo();
        this.#config.header.username = this.#config.user.firstname;
        const page = new Write__Letter(this.root, this.#config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }

    /**
     * Запрашивает у сервера имя пользователя
     * @returns {string} имя пользователя
     */
    async #getUserInfo() {
        await dispathcher.do(actionGetUser());
        return userStore.body;
    }

}

export default new WriteLetterView();