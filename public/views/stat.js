import Stat from '../pages/stat/stat.js';
import BaseView from './base.js';
import folderStore from '../stores/folderStore.js';
import emailStore from '../stores/emailStore.js';


/**
 * Класс для рендера страницы логина
 * @class
 */
class StatView extends BaseView {
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
        document.title = 'Статистика';
        this.#config.user = await this.getUserInfo();
        this.#config.menu.folders = folderStore.folders;
        this.#config.header.username = this.#config.user.firstname;
        this.#config.header.avatar = this.#config.user.avatar;
        this.#config.stat = await this.getStatInfo();
        if (emailStore.incoming_count > 0) {
            this.#config.menu.incoming_count = emailStore.incoming_count;
        } else {
            this.#config.menu.incoming_count = undefined;
        }
        const page = new Stat(this.root, this.#config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }

}

export default new StatView();