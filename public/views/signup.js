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
    renderPage(vkUser = undefined) {
        this.#config.vkUser = vkUser;
        let page;
        if (vkUser) {
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
