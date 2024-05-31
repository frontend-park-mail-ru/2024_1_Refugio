import dispathcher from '../../modules/dispathcher.js';
import { actionGetAuthUrlSignUpVK, actionLogout, actionRedirect, actionSend, actionGetVkAuthInfo, actionVkLogin } from '../../actions/userActions.js';
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

    notification = () => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            const notification = new Notification(`Сначала пройдите регистрацию через VK ID`);
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    const notification = new Notification(`Сначала пройдите регистрацию через VK ID`);
                }
            });
        }
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        mediator.on('vkLogin', this.handleVkLoginResponse);
        mediator.on('getAuthUrlSignUpVK', this.handleVkSignupResponse)
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        mediator.off('vkLogin', this.handleVkLoginResponse);
        mediator.off('getAuthUrlSignUpVK', this.handleVkSignupResponse)

    }

    handleVkLoginResponse = (data) => {
        console.log(data);
        switch (data.status) {
            case 200:
                dispathcher.do(actionRedirect('/main', true));
                break;
            case 401:
                if (window.matchMedia("(min-width: 700px)").matches) {
                    this.notification()
                }
                dispathcher.do(actionGetAuthUrlSignUpVK());
                break;
            default:
                dispathcher.do(actionRedirect('/login', true, "Проблема на нашей стороне, уже исправляем"));
        }
    }

    handleVkSignupResponse = (data) => {
        switch (data.status) {
            case 200:
                window.location.href = data.link;
                break;
            default:
                dispathcher.do(actionRedirect('/login', true, "Проблема на нашей стороне, уже исправляем"));
                break;
        }
    }
}
