import dispathcher from "../modules/dispathcher.js";
import userStore from "../stores/userStore.js";
import emailStore from "../stores/emailStore.js";
import statStore from "../stores/statStore.js";
import { actionGetEmail, actionGetFolders, actionGetUser, actionGetStatistic, actionGetSent, actionGetIncoming } from "../actions/userActions.js";
/**
 * Класс для рендера абстрактной страницы
 * @class
 */
export default class BaseView {
    components = [];
    root;

    /**
     * Конструктор класса
     * @constructor
     */
    constructor() {
        this.root = document.querySelector('#root');
    }

    /**
     * Функция рендера каждого элемента страницы
     */
    render() {
        this.components.forEach((component) => component.render());
    }

    /**
     * Функция добавления необходимых листенеров всем элементам страницы
     */
    addListeners() {
        this.components.forEach((component) => component.addListeners());
    }

    /**
     * Функция удаления листенеров
     */
    removeListeners() {
        this.components.forEach((component) => component.removeListeners());
    }

    /**
     * Функция очищения страницы
     */
    clear() {
        this.removeListeners();
        this.root.innerHTML = '';
        this.components = [];
    }

    /**
     * Запрашивает у сервера имя пользователя
     * @returns {string} имя пользователя
     */
    async getUserInfo() {
        await dispathcher.do(actionGetUser());
        await dispathcher.do(actionGetFolders());
        return userStore.body;
    }

    async getStatInfo() {
        await dispathcher.do(actionGetStatistic());
        return statStore.stat;
    }

    /**
     * Запрашивает у сервера список писем пользователся
     * @returns {Array<object>} список писем
     */
    async getEmailInfo(id) {
        await dispathcher.do(actionGetEmail(id));
        return emailStore.email;
    }

    async getSentInfo() {
        await dispathcher.do(actionGetSent());
        return emailStore.sent;
    }

    async getEmailsInfo() {
        await dispathcher.do(actionGetIncoming());
        return emailStore.incoming;
    }
}