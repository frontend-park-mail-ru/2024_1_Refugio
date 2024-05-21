import BaseView from './base.js';
import Vk__Signup__Helper from '../pages/vk-signup-helper/vk-signup-helper.js'

/**
 * Класс для рендера страницы списка писем
 * @class
 */
export default class VkSignupHelperView extends BaseView {

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
        const page = new Vk__Signup__Helper(this.root, this.#config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }
}