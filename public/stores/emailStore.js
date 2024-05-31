import userStore from "./userStore.js";
import ajax from "../modules/ajax.js";
import mediator from "../modules/mediator.js";
import Websocket from "../modules/websocket.js";

/**
 * Класс хранилища для писем
 * @class
 */
class emaillStore {
    incoming
    old_incoming_count
    incoming_count
    sent

    /**
     * Конструктор класса
     * @constructor
     */
    constructor() {
        this.incoming = undefined
    }

    /**
     * Функция очистки полей класса
     */
    clean() {
        this.incoming = undefined
    }

    /**
     * Функция формирования запроса получения списка входящих с сервера
     */
    async getIncoming() {
        if (userStore?.isAuth && !userStore?.websocket) {
            userStore.websocket = new Websocket(`wss://mailhub.su/api/v1/auth/web/websocket_connection/${userStore?.body?.login}`);
        }
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/emails/incoming', null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.incoming = data.body.emails;
        this.old_incoming_count = this.incoming_count;
        this.incoming_count = 0;
        if (this.incoming) {
            this.incoming.forEach((letter) => {
                if (!letter.readStatus) {
                    this.incoming_count += 1;
                }
            });
        }
    }

    /**
     * Функция формирования запроса получения списка отправленных с сервера
     */
    async getSent() {
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/emails/sent', null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.sent = data.body.emails;
    }

    /**
     * Функция формирования запроса получения письма с сервера
     */
    async getEmail(id) {
        const response = await ajax(
            'GET', `https://mailhub.su/api/v1/email/${id}`, null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.email = data.body.email;
    }

    /**
     * Функция формирования запроса отправки письма на сервере
     */
    async send(newEmail) {
        if (userStore?.isAuth && !userStore?.websocket) {
            userStore.websocket = new Websocket(`https://mailhub.su/api/v1/auth/web/websocket_connection/${userStore?.body?.login}`);
        }
        const response = await ajax(
            'POST', 'https://mailhub.su/api/v1/email/send', JSON.stringify(newEmail), 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        const data = await response.json();
        if (status === 200) {
            const responseId = data.body.email.id;
            userStore.websocket.send(JSON.stringify(data));
            mediator.emit('send', { id: responseId, status });
        } else {
            mediator.emit('send', { id: 400, status });
        }
    }

    /**
     * Функция формирования запроса обновления письма на сервере
     */
    async updateEmail({ id, value, spam }) {
        const response = await ajax(
            'PUT', `https://mailhub.su/api/v1/email/update/${id}`, JSON.stringify(value), 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        if (value.readStatus) {
            this.incoming_count = Math.max(0, this.incoming_count - 1);
        } else {
            // this.incoming_count += 1;
        }
        this.old_incoming_count = this.incoming_count;

        if (spam) {
            mediator.emit('updateSpam', status);
        } else {
            mediator.emit('updateEmail', status);
        }
    }

    /**
     * Функция формирования запроса удаления письма на сервере
     */
    async deleteEmail({ id }) {
        const response = await ajax(
            'DELETE', `https://mailhub.su/api/v1/email/delete/${id}`, null, 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        mediator.emit('deleteEmail', status);
    }

    /**
     * Функция формирования запроса получения списка спама с сервера
     */
    async getSpam() {
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/emails/spam', null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.spam = data.body.emails;
    }

    async attachFile(file) {
        const response = await ajax(
            'POST', 'https://mailhub.su/api/v1/email/addfile', file.file, undefined, userStore.getCsrf()
        );
        const status = await response.status;
        const data = await response.json();
        const id = data.body.FileId;
        mediator.emit('attachFile', { status, id });
    }

    async deleteAttachment(id) {
        const response = await ajax(
            'DELETE', `https://mailhub.su/api/v1/email/delete/file/${id}`, null, 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        mediator.emit('deleteAttachment', { status, id });
    }

    async bindAttachmentToLetter({ letterId, attachmentId }) {
        const response = await ajax(
            'POST', `https://mailhub.su/api/v1/email/${letterId}/file/${attachmentId}`, null, undefined, userStore.getCsrf()
        );
        const status = await response.status;
        mediator.emit('bindAttachmentToLetter', { status, id: letterId });
    }

    async getAttachments(id) {
        const response = await ajax(
            'GET', `https://mailhub.su/api/v1/email/${id}/get/files/`, null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.files = data.body.files;
    }

    async sendToForeignDomain(id) {
        const response = await ajax(
            'POST', `https://mailhub.su/api/v1/email/sendToOtherDomain/${id}`, null, 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        mediator.emit('sendToForeignDomain', status);
    }

    webSocketListLettersUpdate(value) {
        mediator.emit('webSocketListLettersUpdate', value);
    }
}

export default new emaillStore();