import Main from '../pages/main/main.js';
import BaseView from './base.js';
import emailStore from '../stores/emailStore.js';
import folderStore from '../stores/folderStore.js';

/**
 * Класс для рендера страницы списка писем
 * @class
 */
export default class FolderView extends BaseView {
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
        folderNumber: undefined,
    };

    /**
     * Конструктор класса
     * @constructor
     */
    constructor(folderNumber) {
        super();
        this.#config.folderNumber = folderNumber;
    }

    /**
     * Функция рендера страницы
     */
    async renderPage() {
        this.#config.user = await this.getUserInfo();
        this.#config.menu.folders = folderStore.folders;
        this.#config.menu.folders.forEach((element) => {
            if (element.id === Number(this.#config.folderNumber)) {
                document.title = element.name;
            }
        });
        this.#config.header.username = this.#config.user.firstname;
        this.#config.header.login = this.#config.user.login;
        this.#config.header.avatar = this.#config.user.avatar;
        this.#config.content.list_letters = await this.getFolderInfo(this.#config.folderNumber);
        if (emailStore.incoming_count > 0) {
            this.#config.menu.incoming_count = emailStore.incoming_count;
        } else {
            this.#config.menu.incoming_count = undefined;
        }
        const page = new Main(this.root, this.#config);
        this.components.push(page);
        //this.components.push(survey);
        this.render();
        this.addListeners();
    }
}
