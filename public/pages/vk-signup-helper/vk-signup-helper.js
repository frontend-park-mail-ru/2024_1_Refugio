import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionRedirect, actionSend, actionGetVkAuthInfo, actionVkLogin } from '../../actions/userActions.js';
import mediator from '../../modules/mediator.js';
import router from '../../modules/router.js';


/**
 * Класс обертки страницы
 * @class
 */
export default class Vk__Signup__Helper {
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
        dispathcher.do(actionVkLogin(code));
    }

    handleAjax1 = async () => {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");
        dispathcher.do(actionGetVkAuthInfo(code));
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        mediator.on('vkLogin', this.handleVkLoginResponse);
        mediator.on('getVkAuthInfo', this.handleVkAuthInfoResponse)
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        mediator.off('getVkAuthInfo', this.handleVkAuthInfoResponse)
        mediator.off('vkLogin', this.handleVkLoginResponse);
    }

    handleVkLoginResponse = (data) => {
        console.log(data);
        switch (data.status) {
            case 200:
                dispathcher.do(actionRedirect('/main', true));
                break;
            default:
                this.handleAjax1();
        }
    }

    handleVkAuthInfoResponse = (data) => {
        switch (data.status) {
            case 200:
                dispathcher.do(actionRedirect('/signup', true, data))
                break;
            default:
                alert('беда');
                break;
        }
    }
}
