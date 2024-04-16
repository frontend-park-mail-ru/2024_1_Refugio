import Main from '../pages/main/main.js';
import BaseView from './base.js';
import dispathcher from '../modules/dispathcher.js';
import { actionGetUser, actionGetIncoming } from '../actions/userActions.js';
import userStore from '../stores/userStore.js';
import emailStore from '../stores/emailStore.js';

/**
 * Класс для рендера страницы списка писем
 * @class
 */
class MainView extends BaseView {
    #config = {
        header: {
            logo: 'MailHub',
            search: 'Поиск',
            username: 'Профиль',
            avatar: '',
        },
        menu: {},
        content: {
            list_letters: [
                // {
                //     status: undefined,
                //     photoId: '/static/img/avatar_32_32.svg',
                //     from: 'ivanovii@mail.ru',
                //     subject: 'Subject',
                //     text: 'Some text about fish',
                //     date: '12/12/2012'
                // },
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
        document.title = 'Входящие';
        this.#config.user = await this.#getUserInfo();
        this.#config.header.username = this.#config.user.firstname;
        this.#config.header.avatar = this.#config.user.avatar;
        this.#config.content.list_letters = await this.#getEmailsInfo();
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
        await dispathcher.do(actionGetUser());
        return userStore.body;
    }

    /**
     * Запрашивает у сервера список писем пользователся
     * @returns {Array<object>} список писем
     */
    async #getEmailsInfo() {
        await dispathcher.do(actionGetIncoming());
        return emailStore.incoming;
    }
}

export default new MainView();
