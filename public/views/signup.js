import Signup from '../pages/signup/signup.js';
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
        const page = new Signup(this.root, this.#config);
        document.title = 'Создание ящика';
        this.components.push(page);
        this.render();
        this.addListeners();
    }

}

export default new SignupView();
