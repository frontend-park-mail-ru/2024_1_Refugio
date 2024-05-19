import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionRedirect, actionSend, actionGetAuthUrlSignUpVK } from '../../actions/userActions.js';
import mediator from '../../modules/mediator.js';
import template from './vk-auth-helper.hbs'
import router from '../../modules/router.js';


/**
 * Класс обертки страницы
 * @class
 */
export default class Vk__Auth__Helper {
    #parent;
    #config;

    /**
     * Конструктор класса
     * @constructor
     * @param {Element} parent
     * @param {object} config
     */

    constructor(parent, config) {
        this.#config = config;
        this.#parent = parent;
    }

    /**
     * Рендер компонента в DOM
     */
    render() {
        const config = this.#config;
        this.#parent.insertAdjacentHTML('beforeend', template());
    }

    handleAjax = async (e) => {
        e.preventDefault();
        dispathcher.do(actionGetAuthUrlSignUpVK());
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#parent.addEventListener("click", this.handleAjax);
        mediator.on('getAuthUrlSignUpVK', this.handleVkSignupResponse);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent.removeEventListener("click", this.handleAjax);
        mediator.off('getAuthUrlSignUpVK', this.handleVkSignupResponse);
    }

    handleVkSignupResponse = (data) => {
        const error = this.#parent
            .querySelector('#signup-error');
        switch (data.status) {
            case 200:
                window.location.href = data.link;
                break;
            default:
                error.textContent = 'VKПроблема на нашей стороне. Уже исправляем';
                error.classList.add('show');
                break;
        }
    }
}
