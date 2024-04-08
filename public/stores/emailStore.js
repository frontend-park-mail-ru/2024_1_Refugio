import userStore from "./userStore.js";
import ajax from "../modules/ajax.js";

class emaillStore {
    incoming

    constructor() {
        this.incoming = undefined
    }

    clean() {
        this.incoming = undefined
    }

    async getIncoming() {
        const response = await ajax(
            'GET', 'http://mailhub.su:8080/api/v1/emails/incoming', null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.incoming = data.body.emails;
    }

    async getEmail(id) {
        const response = await ajax(
            'GET', `http://mailhub.su:8080/api/v1/email/${id}`, null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.email = data.body.email;
    }
}

export default new emaillStore();