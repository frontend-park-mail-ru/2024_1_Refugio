import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionRedirect, actionSend, actionGetVkAuthInfo } from '../../actions/userActions.js';
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

        // dispathcher.do(actionGetVkAuthInfo('855ab871bba885204e'));
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {

        mediator.on('getVkAuthInfo', this.handleVkAuthInfoResponse)

        // mediator.on('getAuthUrlSignUpVK', this.handleVkSignupResponse);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        mediator.off('getVkAuthInfo', this.handleVkAuthInfoResponse)



        // mediator.off('getAuthUrlSignUpVK', this.handleVkSignupResponse);
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
