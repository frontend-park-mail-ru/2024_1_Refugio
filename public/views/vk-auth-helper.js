import BaseView from './base.js';
import Vk__Auth__Helper from '../pages/vk-auth-helper/vk-auth-helper.js'

/**
 * Класс для рендера страницы списка писем
 * @class
 */
export default class VkAuthHelperView extends BaseView {

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
        const page = new Vk__Auth__Helper(this.root, this.#config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }
}