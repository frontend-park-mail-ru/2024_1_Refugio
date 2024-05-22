import Letter from '../pages/letter/letter.js';
import BaseView from './base.js';
import folderStore from '../stores/folderStore.js';
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
        files: {}
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
        this.#config.email = await this.getEmailInfo(this.#config.letterNumber);
        if (this.#config.email.replyToEmailId) {
            this.#config.replyEmail = await this.getEmailInfo(this.#config.email.replyToEmailId);
        }
        if (emailStore.incoming_count > 0) {
            this.#config.menu.incoming_count = emailStore.incoming_count;
        }
        document.title = this.#config.email.topic;
        this.#config.user = await this.getUserInfo();
        this.#config.menu.folders = folderStore.folders;
        this.#config.menu.letter_folders = await this.getLetterFoldersInfo(this.#config.letterNumber);
        this.#config.header.username = this.#config.user.firstname;
        this.#config.header.login = this.#config.user.login;
        this.#config.header.avatar = this.#config.user.avatar;
        if (emailStore.incoming_count > 0) {
            this.#config.menu.incoming_count = emailStore.incoming_count;
        } else {
            this.#config.menu.incoming_count = undefined;
        }
        this.#config.files = await this.getAttachments(this.#config.letterNumber);
        const page = new Letter(this.root, this.#config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }



}