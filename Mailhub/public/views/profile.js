import '../pages/profile/profile.js';
import './base.js';
import '../stores/userStore.js';
import '../modules/dispathcher.js';
import '../actions/userActions.js';

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
        this.#config.user = await this.#getUserInfo();
        this.#config.header.username = this.#config.user.firstname;
        this.#config.header.avatar = this.#config.user.avatar;
        const page = new Profile(this.root, this.#config);
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

export default new ProfileView();