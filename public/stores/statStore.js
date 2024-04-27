import ajax from "../modules/ajax.js";
import userStore from "./userStore.js";

class statStore {
    questions
    stat

    constructor() {
        this.questions = undefined;
        this.stat = undefined;
    }

    async getQuestions() {
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/emails/incoming', null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.questions = data;
    }

    async send({newAnswer, id}) {
        const response = await ajax(
            'POST', 'https://mailhub.su/api/v1/email/send', JSON.stringify(newAnswer), 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        elements = {
            id: id,
            answer: newAnswer,
        }
        mediator.emit('sendStat', elements);
    }

    async getStat() {
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/emails/incoming', null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.stat = data;
    }
}

export default new statStore();
