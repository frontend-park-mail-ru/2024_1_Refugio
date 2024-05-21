import userStore from "./userStore.js";
import ajax from "../modules/ajax.js";
import mediator from "../modules/mediator.js";

/**
 * Класс хранилища для папок
 * @class
 */
class folderStore {
    folders
    letter_folders

    /**
     * Конструктор класса
     * @constructor
     */
    constructor() {
        this.folders = undefined;
        this.letter_folders = undefined;
    }

    /**
     * Функция очистки полей класса
     */
    clean() {
        this.folders = undefined;
        this.letter_folders = undefined;
    }

    /**
     * Функция формирования запроса создания папки на сервере
     */
    async create(newFolder) {
        const response = await ajax(
            'POST', 'https://mailhub.su/api/v1/folder/add', JSON.stringify(newFolder), 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        mediator.emit('createFolder', status);
    }

    /**
     * Функция формирования запроса обновления папки на сервере
     */
    async update({id, value}) {
        const response = await ajax(
            'PUT', `https://mailhub.su/api/v1/folder/update/${id}`, JSON.stringify(value), 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        mediator.emit('updateFolder', {status:status, id: id});
    }

    /**
     * Функция формирования запроса удаления папки на сервере
     */
    async delete(id) {
        const response = await ajax(
            'DELETE', `https://mailhub.su/api/v1/folder/delete/${id}`, null, 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        mediator.emit('deleteFolder', {status:status, id: id});
    }

    /**
     * Функция формирования запроса получения папок с сервера
     */
    async getFolders() {
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/folder/all', null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.folders = data.body.folders;
        return this.folders;
    }

    /**
     * Функция формирования запроса получения писем в папке с сервера
     */
    async getFolderEmails(id) {
        const response = await ajax(
            'GET', `https://mailhub.su/api/v1/folder/all_emails/${id}`, null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.emails = data.body.folders;
    }

    /**
     * Функция формирования запроса добавления письма в папку
     */
    async addLetter(value) {
        const response = await ajax(
            'POST', `https://mailhub.su/api/v1/folder/add_email`, JSON.stringify(value), 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        mediator.emit('addLetterToFolder', {status:status, id: value.folderId});
    }

    /**
     * Функция формирования запроса удаления письма из папки
     */
    async deleteLetter(value) {
        const response = await ajax(
            'DELETE', `https://mailhub.su/api/v1/folder/delete_email`, JSON.stringify(value), 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        mediator.emit('addLetterToFolder', {status:status, id: value.folderId});
    }

    /**
     * Функция формирования запроса получения папок письма с сервера
     */
    async getLetterFolders(id) {
        const response = await ajax(
            'GET', `https://mailhub.su/api/v1/folder/allname/${id}`, null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.letter_folders = data.body.folders;
        return this.letter_folders;
    }
}

export default new folderStore();