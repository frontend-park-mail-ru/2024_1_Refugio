import template from './survey.hbs';
import mediator from '../../modules/mediator.js';
import dispathcher from '../../modules/dispathcher.js';
import {actionGetQuestions} from '../../actions/userActions.js';
import statStore from '../../stores/statStore.js';

/**
 * Класс обертки страницы
 * @class
 */
export default class Survey {
    #parent;
    #config;

    /**
     * Конструктор класса
     * @constructor
     * @param {Element} parent
     * @param {object} config
     */
    constructor(parent, config) {
        this.#config = config;
        this.#parent = parent;
    }

    /**
     * Рендер компонента в DOM
     */
    async render() {
        this.#config.questions = await this.#getQuestionInfo();
        const elements = {
            // question: this.#config.questions.question[0],
            // bad: this.#config.questions.bad[0],
            // good: this.#config.questions.good[0],
        };
        this.#parent.insertAdjacentHTML('beforeend', template());
    }

    async #getQuestionInfo() {
        // await dispathcher.do(actionGetQuestions());
        // return statStore.questions;
    }

    addListeners() {
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .addEventListener('click', this.handleExit);
        // mediator.on('sendStat', this.handleNext);
    }


}
