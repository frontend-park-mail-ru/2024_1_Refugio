import BaseView from './base.js';
import Survey from '../pages/survey/survey.js';

/**
 * Класс для рендера страницы логина
 * @class
 */
class SurveyView extends BaseView {
    #config = {
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
        const page = new Survey(this.root, this.#config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }
}

export default new SurveyView();