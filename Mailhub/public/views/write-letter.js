import './base.js';
import '../pages/write-letter/write-letter.js';
import '../stores/userStore.js';
import '../modules/dispathcher.js';
import '../actions/userActions.js';

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

    /**
     * Функция рендера страницы
     */
    async renderPage(data = undefined) {
        if (data) {
            this.#config.values = data;
        } else {
            this.#config.values = undefined;
        }
        document.title = 'Новое письмо';
        this.#config.user = await this.#getUserInfo();
        this.#config.header.username = this.#config.user.firstname;
        this.#config.header.avatar = this.#config.user.avatar;
        const page = new Write__Letter(this.root, this.#config);
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

}

export default new WriteLetterView();