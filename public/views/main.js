import Main from '../pages/main/main.js';
import BaseView from './base.js';
import emailStore from '../stores/emailStore.js';
import Survey from '../pages/survey/survey.js';
import folderStore from '../stores/folderStore.js';

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
        this.#config.user = await this.getUserInfo();
        this.#config.menu.folders = folderStore.folders;
        this.#config.header.username = this.#config.user.firstname;
        this.#config.header.login = this.#config.user.login;
        this.#config.header.avatar = this.#config.user.avatar;
        this.#config.content.list_letters = await this.getEmailsInfo();
        if (emailStore.incoming_count > 0) {
            this.#config.menu.incoming_count = emailStore.incoming_count;
        } else {
            this.#config.menu.incoming_count = undefined;
        }
        const page = new Main(this.root, this.#config);
        const survey = new Survey(this.root, this.#config);
        this.components.push(page);
        //this.components.push(survey);
        this.render();
        this.addListeners();
    }
}

export default new MainView();
