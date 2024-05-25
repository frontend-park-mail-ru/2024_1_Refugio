import dispathcher from "../modules/dispathcher.js";
import userStore from "../stores/userStore.js";
import emailStore from "../stores/emailStore.js";
import { actionGetSpam, actionGetEmail, actionGetFolders, actionGetUser, actionGetSent, actionGetIncoming, actionGetFolderEmails, actionGetLetterFolders, actionGetAttachments } from "../actions/userActions.js";
import draftStore from "../stores/draftStore.js";
import { actionGetDrafts } from "../actions/draftActions.js";
import folderStore from "../stores/folderStore.js";
import router from "../modules/router.js";
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
        router.isLoading = false;
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

    /**
     * Запрашивает у сервера список папок письма
     * @param {Number} id id письма
     * @returns {Array<object>} список папок
     */
    async getLetterFoldersInfo(id) {
        await dispathcher.do(actionGetLetterFolders(id));
        return folderStore.letter_folders;
    }

    /**
     * Запрашивает у сервера статистику приложения
     * @returns {Array<object>} список писем
     */
    async getStatInfo() {
        await dispathcher.do(actionGetStatistic());
        return statStore.stat;
    }

    /**
     * Запрашивает у сервера письмо пользователя
     * @param {Number} id id письма
     * @returns {object} письмо
     */
    async getEmailInfo(id) {
        await dispathcher.do(actionGetEmail(id));
        return emailStore.email;
    }

    /**
     * Запрашивает у сервера список отправленных писем пользователя
     * @returns {Array<object>} список писем
     */
    async getSentInfo() {
        await dispathcher.do(actionGetSent());
        return emailStore.sent;
    }

    /**
     * Запрашивает у сервера список входящих писем пользователя
     * @returns {Array<object>} список писем
     */
    async getEmailsInfo() {
        await dispathcher.do(actionGetIncoming());
        return emailStore.incoming;
    }

    /**
     * Запрашивает у сервера список черновиков пользователя
     * @returns {Array<object>} список писем
     */
    async getDraftsInfo() {
        await dispathcher.do(actionGetDrafts());
        return draftStore.drafts;
    }

    /**
     * Запрашивает у сервера список спама пользователя
     * @returns {Array<object>} список писем
     */
    async getSpamInfo() {
        await dispathcher.do(actionGetSpam());
        return emailStore.spam;
    }

    /**
     * Запрашивает у сервера список папок пользователя
     * @returns {Array<object>} список папок
     */
    async getFolderInfo(id) {
        await dispathcher.do(actionGetFolderEmails(id));
        return folderStore.emails;
    }

    async getAttachments(id) {
        await dispathcher.do(actionGetAttachments(id));
        return emailStore.files;
    }
}