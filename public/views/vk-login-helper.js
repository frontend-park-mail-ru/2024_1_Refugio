import BaseView from './base.js';
import Vk__Login__Helper from '../pages/vk-login-helper/vk-login-helper.js'

/**
 * Класс для рендера страницы списка писем
 * @class
 */
export default class VkLoginHelperView extends BaseView {

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
        const page = new Vk__Login__Helper(this.root, this.#config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }
}