import ajax from "../modules/ajax.js";

import userStore from "./userStore.js";

import mediator from "../modules/mediator.js";

/**
 * Класс хранилища для статистики
 * @class
 */
class statStore {
    questions
    stat
    raiting
    count
    max

    /**
     * Конструктор класса
     * @constructor
     */
    constructor() {
        this.questions = undefined;
        this.stat = undefined;
        this.raiting = undefined;
        this.count = undefined;
        this.max = undefined;
    }

    /**
     * Функция формирования запроса получения вопросов с сервера
     */
    async getQuestions() {
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/questions', null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.questions = data.body.questions;
        this.max = data.body.questions.length;
        this.count = 0;
    }

    /**
     * Функция формирования запроса отправки отчета на сервер
     */
    async send({newAnswer, id}) {
        const response = await ajax(
            'POST', 'https://mailhub.su/api/v1/answers', JSON.stringify(newAnswer), 'application/json', userStore.getCsrf()
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

    /**
     * Функция формирования запроса получения статистики с сервера
     */
    async getStat() {
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/statistics', null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.stat = data.body.statistic;
    }

    /**
     * Функция выставления рейтинга
     */
    changeStar(id) {
        this.raiting = id;
        mediator.emit('changeStar', this.raiting);
    }
}

export default new statStore();
