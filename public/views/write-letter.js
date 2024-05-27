import BaseView from './base.js';
import Write__Letter from '../pages/write-letter/write-letter.js';
import emailStore from '../stores/emailStore.js';
import folderStore from '../stores/folderStore.js';

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

    updateListeners = () => {
        this.removeListeners();
        this.addListeners();
    }

    /**
     * Функция рендера страницы
     */
    async renderPage(data = undefined) {
        console.log(data);
        if (data) {
            this.#config.values = data;
        } else {
            this.#config.values = undefined;
        }
        if (emailStore.incoming_count > 0) {
            this.#config.menu.incoming_count = emailStore.incoming_count;
        }
        document.title = 'Новое письмо';
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
        this.#config.files = await this.getAttachments(data?.id);

        const page = new Write__Letter(this.root, this.#config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }

}
export default new WriteLetterView();