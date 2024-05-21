import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionRedirect, actionSend, actionGetVkAuthInfo, actionVkLogin } from '../../actions/userActions.js';
import mediator from '../../modules/mediator.js';
import template from './vk-login-helper.hbs'
import router from '../../modules/router.js';


/**
 * Класс обертки страницы
 * @class
 */
export default class Vk__Login__Helper {
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
        // let params = (new URL(document.location)).searchParams;
        // console.log(params.get("data"));
        dispathcher.do(actionVkLogin('855ab871bba885204e'));

    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#parent.addEventListener("click", this.handleAjax);
        this.#parent.addEventListener("load", this.handleAjax);
        mediator.on('getVkAuthInfo', this.handleVkAuthInfoResponse);
        mediator.on('vkLogin', this.handleVkLoginResponse);


        // mediator.on('getAuthUrlSignUpVK', this.handleVkSignupResponse);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent.removeEventListener("click", this.handleAjax);
        this.#parent.removeEventListener("load", this.handleAjax);
        mediator.off('getVkAuthInfo', this.handleVkAuthInfoResponse);
        mediator.off('vkLogin', this.handleVkLoginResponse);



        // mediator.off('getAuthUrlSignUpVK', this.handleVkSignupResponse);
    }

    handleVkAuthInfoResponse = (data) => {
        switch (data.status) {
            case 200:
                dispathcher.do(actionRedirect('/signup', true, data))
                break;
            default:
                alert('беда');
        }
    }

    handleVkLoginResponse = (data) => {
        switch (data.status) {
            case 200:
                dispathcher.do(actionRedirect('/main', true));
                break;
            case 401:
                dispathcher.do(actionRedirect('/login', true, "Сначала зарегистрируйтесь через VK ID"));
                break;
            default:
                dispathcher.do(actionRedirect('/login', true, "Проблема на нашей стороне, уже исправляем"));
        }
    }
}
