import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionRedirect, actionSend, actionGetVkAuthInfo, actionVkLogin } from '../../actions/userActions.js';
import mediator from '../../modules/mediator.js';
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
        this.handleAjax();
    }

    handleAjax = async () => {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");
        console.log(code);
        console.log('login helper');
        dispathcher.do(actionVkLogin(code));

    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        mediator.on('vkLogin', this.handleVkLoginResponse);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        mediator.off('vkLogin', this.handleVkLoginResponse);



        // mediator.off('getAuthUrlSignUpVK', this.handleVkSignupResponse);
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
