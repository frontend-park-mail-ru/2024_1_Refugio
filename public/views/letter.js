import Letter from '../pages/letter/letter.js';
import BaseView from './base.js';
import dispathcher from '../modules/dispathcher.js';
import { actionGetEmail, actionGetUser } from '../actions/userActions.js';
import emailStore from '../stores/emailStore.js';
import userStore from '../stores/userStore.js';

/**
 * Класс для рендера страницы логина
 * @class
 */
export default class LetterView extends BaseView {
    #config = {
        menu: {},
        header: {
            avatar: '',
        },
        letterNumber: undefined,
    }

    /**
         * Конструктор класса
         * @constructor
         */
    constructor(letterNumber) {
        super();
        this.#config.letterNumber = letterNumber;
    }

    /**
     * Функция рендера страницы
     */
    async renderPage() {
        this.#config.email = await this.#getEmailInfo(this.#config.letterNumber);
        if (this.#config.email.replyToEmailId) {
            this.#config.replyEmail = await this.#getEmailInfo(this.#config.email.replyToEmailId);
        }
        document.title = this.#config.email.topic;
        this.#config.user = await this.#getUserInfo();
        this.#config.header.username = this.#config.user.firstname;
        this.#config.header.avatar = this.#config.user.avatar;
        const page = new Letter(this.root, this.#config);
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

    async #getEmailInfo(id) {
        await dispathcher.do(actionGetEmail(id));
        return emailStore.email;
    }

}