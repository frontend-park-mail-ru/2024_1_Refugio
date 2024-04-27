import ajax from "../modules/ajax.js";
import userStore from "./userStore.js";
import mediator from "../modules/mediator.js";

class statStore {
    questions
    stat
    raiting
    count
    max

    constructor() {
        this.questions = undefined;
        this.stat = undefined;
        this.raiting = undefined;
        this.count = undefined;
        this.max = undefined;
    }

    async getQuestions() {
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/emails/incoming', null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.questions = data.body;
        this.max = data.body.length();
        this.count = 0;
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
        this.raiting = undefined;
        this.count += 1;
        mediator.emit('sendStat', elements);
    }

    async getStat() {
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/emails/incoming', null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.stat = data;
    }

    changeStar(id) {
        this.raiting = id;
        mediator.emit('changeStar', this.raiting);
    }
}

export default new statStore();
