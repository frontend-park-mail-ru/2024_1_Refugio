import userStore from "./userStore.js";
import ajax from "../modules/ajax.js";
import mediator from "../modules/mediator.js";

class emaillStore {
    incoming
    sent

    constructor() {
        this.incoming = undefined
    }

    clean() {
        this.incoming = undefined
    }

    async getIncoming() {
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/emails/incoming', null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.incoming = data.body.emails;
    }

    async getSent() {
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/emails/sent', null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.sent = data.body.emails;
    }


    async getEmail(id) {
        const response = await ajax(
            'GET', `https://mailhub.su/api/v1/email/${id}`, null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.email = data.body.email;
    }

    async send(newEmail) {
        const response = await ajax(
            'POST', 'https://mailhub.su/api/v1/email/send', JSON.stringify(newEmail), 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        mediator.emit('send', status);
    }

    async updateEmail({id, value}) {
        const response = await ajax(
            'PUT', `https://mailhub.su/api/v1/email/update/${id}`, JSON.stringify(value), 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        return status;
    }

    async deleteEmail({id}) {
        const response = await ajax(
            'DELETE', `https://mailhub.su/api/v1/email/delete/${id}`,null, 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        return status;
    }
}

export default new emaillStore();