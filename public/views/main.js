import Main from '../pages/main/main.js'
import BaseView from './base.js'
import ajax from '../modules/ajax.js'

/**
 * Класс для рендера страницы списка писем
 * @class
 */
export default class MainView extends BaseView {
    #config = {
        header: {
            logo: 'MailHub',
            search: 'Поиск',
            username: 'Профиль',
        },
        menu: {},
        content: {
            list_letters: [
                {
                    photoId: 'static/img/1200px-User_icon-cp.svg.png',
                    topic: 'Письмо',
                    text: 'Some text about fish',
                },
                {
                    photoId: 'static/img/1200px-User_icon-cp.svg.png',
                    topic: 'Письмо',
                    text: 'Some text about fish',
                },
                {
                    photoId: 'static/img/1200px-User_icon-cp.svg.png',
                    topic: 'Письмо',
                    text: 'Some text about fish',
                },
            ],
        },
    };

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
        this.#config.header.username = await this.#getUserInfo();
        this.#config.content.list_letters = await this.#getEmailsInfo();
        this.#config.content.list_letters.forEach((letter) => {
            if (!letter.photoId) {
                letter.photoId = 'static/img/1200px-User_icon-cp.svg.png';
            }
        });
        const page = new Main(this.root, this.#config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }

    /**
     * Запрашивает у сервера имя пользователя
     * @returns {string} имя пользователя
     */
    async #getUserInfo() {
        const response = await ajax(
            'GET', 'http://89.208.223.140:8080/api/v1/get-user', null, 'application/json'
        );
        const data = await response.json();
        return data.body.user.name;
    }

    /**
     * Запрашивает у сервера список писем пользователся
     * @returns {Array<object>} список писем
     */
    async #getEmailsInfo() {
        const response = await ajax(
            'GET', 'http://89.208.223.140:8080/api/v1/emails', null, 'application/json'
        );
        const data = await response.json();
        return data.body.emails;
    }
}
