import Stat from '../pages/stat/stat.js';
import BaseView from './base.js';
import userStore from '../stores/userStore.js';
import emailStore from '../stores/emailStore.js';
import dispathcher from '../modules/dispathcher.js';
import { actionGetStatistic, actionGetUser } from '../actions/userActions.js';
import statStore from '../stores/statStore.js';

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
        this.#config.user = await this.#getUserInfo();
        this.#config.header.username = this.#config.user.firstname;
        this.#config.header.avatar = this.#config.user.avatar;
        this.#config.stat = await this.#getStatInfo();
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

    /**
     * Запрашивает у сервера имя пользователя
     * @returns {string} имя пользователя
     */
    async #getUserInfo() {
        await dispathcher.do(actionGetUser());
        return userStore.body;
    }

    async #getStatInfo() {
        await dispathcher.do(actionGetStatistic());
        return statStore.stat;
    }

}

export default new StatView();