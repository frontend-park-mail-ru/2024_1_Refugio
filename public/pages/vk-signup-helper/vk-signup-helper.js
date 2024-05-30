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
        dispathcher.do(actionGetVkAuthInfo(code));
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        mediator.on('getVkAuthInfo', this.handleVkAuthInfoResponse)
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        mediator.off('getVkAuthInfo', this.handleVkAuthInfoResponse)
    }

    handleVkAuthInfoResponse = (data) => {
        switch (data.status) {
            case 200:
                dispathcher.do(actionRedirect('/signup', true, data))
                break;
            default:
                dispathcher.do(actionRedirect('/signup', true, "Проблема на нашей стороне, уже исправляем"));
                break;
        }
    }
}
