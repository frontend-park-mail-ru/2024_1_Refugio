import Signup from '../pages/signup/signup.js';
import Vk__Signup from '../pages/vk-signup/vk-signup.js';
import BaseView from './base.js';

/**
 * Класс для рендера страницы списка писем
 * @class
 */
class SignupView extends BaseView {

    #config = {
        vkUser: undefined,
        authtoken: undefined,
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
    renderPage(data = undefined) {
        this.#config.vkUser = data?.body?.body?.VKUser;
        this.#config.authtoken = data?.authtoken;
        let page;
        if (data?.body?.body?.VKUser) {
            page = new Vk__Signup(this.root, this.#config);

        } else {
            page = new Signup(this.root, this.#config);
        }
        document.title = 'Создание ящика';
        this.components.push(page);
        this.render();
        this.addListeners();
    }

}

export default new SignupView();
