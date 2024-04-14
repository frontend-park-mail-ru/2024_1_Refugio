import '../pages/main/main.js';
import './base.js';
import '../modules/dispathcher.js';
import '../actions/userActions.js';
import '../stores/userStore.js';
import '../stores/emailStore.js';
import '../pages/sent/sent.js';

/**
 * Класс для рендера страницы списка писем
 * @class
 */
class SentView extends BaseView {
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
                {
                    status: undefined,
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: undefined,
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: 'read',
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                }, {
                    status: undefined,
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: undefined,
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: 'read',
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                }, {
                    status: undefined,
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: undefined,
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: 'read',
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: undefined,
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: undefined,
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: 'read',
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: undefined,
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: undefined,
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: 'read',
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: undefined,
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: undefined,
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: 'read',
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: 'read',
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
                },
                {
                    status: 'read',
                    photoId: '/static/img/avatar_32_32.svg',
                    from: 'ivanovii@mail.ru',
                    subject: 'Subject',
                    text: 'Some text about fish',
                    date: '12/12/2012'
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
        document.title = 'Отправленные';
        this.#config.user = await this.#getUserInfo();
        this.#config.header.username = this.#config.user.firstname;
        this.#config.header.avatar = this.#config.user.avatar;
        this.#config.content.list_letters = await this.#getEmailsInfo();
        const page = new Sent(this.root, this.#config);
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
        await dispathcher.do(actionGetSent());
        return emailStore.sent;
    }
}

export default new SentView();