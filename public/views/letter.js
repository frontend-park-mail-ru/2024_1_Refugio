import Letter from '../pages/letter/letter.js';
import BaseView from './base.js';
import dispathcher from '../modules/dispathcher.js';
import { actionGetEmail } from '../actions/userActions.js';
import emailStore from '../stores/emailStore.js';

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
        this.#config.email = await this.#getEmailInfo();
        document.title = this.#config.email.topic;
        const page = new Letter(this.root, this.#config);
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

    async #getEmailInfo() {
        await dispathcher.do(actionGetEmail(this.#config.letterNumber));
        return emailStore.email;
    }

}