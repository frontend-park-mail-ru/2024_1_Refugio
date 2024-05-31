import userStore from "./userStore.js";
import ajax from "../modules/ajax.js";
import mediator from "../modules/mediator.js";

/**
 * Класс хранилища для черновиков
 * @class
 */
class draftStore {
    drafts

    /**
     * Конструктор класса
     * @constructor
     */
    constructor() {
        this.drafts = undefined
    }

    /**
     * Функция очистки полей класса
     */
    clean() {
        this.drafts = undefined
    }

    /**
     * Функция формирования запроса получения списка черновиков с сервера
     */
    async getDrafts() {
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/emails/draft', null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.drafts = data.body.emails;
    }

    /**
     * Функция формирования запроса создания черновика на сервере
     */
    async create(newDraft) {
        const response = await ajax(
            'POST', 'https://mailhub.su/api/v1/email/adddraft', JSON.stringify(newDraft), 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        const data = await response.json();
        const id = data.body.email.id;
        mediator.emit('addDraft', { id, status });
    }
    /**
     * Функция формирования запроса отправки черновика на сервере
     */
    async send({ id, value }) {
        const response = await ajax(
            'POST', 'https://mailhub.su/api/v1/email/send', JSON.stringify(value), 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        const data = await response.json();
        if (status === 200) {
            const responseId = data.body.email.id;

            const response = await ajax(
                'DELETE', `https://mailhub.su/api/v1/email/delete/${id}`, null, 'application/json', userStore.getCsrf()
            );
            const status = await response.status;
            console.log(responseId);

            mediator.emit('send', { id: responseId, status });
        } else {
            mediator.emit('send', { id: 400, status });
        }
    }

    /**
     * Функция формирования запроса изменения черновика на сервера
     */
    async update({ id, value }) {
        const response = await ajax(
            'POST', 'https://mailhub.su/api/v1/email/adddraft', JSON.stringify(value), 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        const data = await response.json();
        const responseId = data.body.email.id;
        if (status === 200) {
            const response = await ajax(
                'DELETE', `https://mailhub.su/api/v1/email/delete/${id}`, null, 'application/json', userStore.getCsrf()
            );
            const status = await response.status;
            mediator.emit('send', { id: responseId, status });
        } else {
            mediator.emit('send', { id: responseId, status });
        }
    }
}

export default new draftStore();