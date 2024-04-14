import Signup from '../pages/signup/signup.js';
import BaseView from './base.js';

const config = {
};
/**
 * Класс для рендера страницы списка писем
 * @class
 */
class SignupView extends BaseView {

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
    renderPage() {
        document.title = 'Создание ящика';
        const page = new Signup(this.root, config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }

}

export default new SignupView();
