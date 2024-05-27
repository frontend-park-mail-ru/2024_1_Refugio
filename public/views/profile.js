import Profile from '../pages/profile/profile.js';
import BaseView from './base.js';
import emailStore from '../stores/emailStore.js';
import folderStore from '../stores/folderStore.js';

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
        this.#config.user = await this.getUserInfo();
        this.#config.menu.folders = folderStore.folders;
        this.#config.header.username = this.#config.user.firstname;
        this.#config.header.login = this.#config.user.login;
        this.#config.header.avatar = this.#config.user.avatar;
        if (emailStore.incoming_count > 0) {
            this.#config.menu.incoming_count = emailStore.incoming_count;
        } else {
            this.#config.menu.incoming_count = undefined;
        }
        const page = new Profile(this.root, this.#config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }



}

export default new ProfileView();