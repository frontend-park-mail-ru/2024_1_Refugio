import dispathcher from '../../modules/dispathcher.js';
import statStore from '../../stores/statStore.js';
import template from './survey.hbs';
import mediator from '../../modules/mediator.js';
import { actionSendStat } from '../../actions/userActions.js';

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
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    async #getQuestionInfo() {
        // await dispathcher.do(actionGetQuestions());
        // return statStore.questions;
    }

    handleExit() {
        this.#parent

            .querySelector('.survey')
            .classList.add('remove');
    }

    handleSend() {
        dispathcher.do(actionSendStat(statStore.count, statStore.raiting));
    }

    handleCheckbox = (e, id) => {
        e.preventDefault();
        dispathcher.do(actionStar(id));
    }

    handleNext({ answer, id }) {
        if (id + 1 === statStore.max) {
            this.handleExit();
        }
        else {
            this.#parent
                .querySelectorAll('.survey__rating-buttons__button').forEach((star) => {
                    star.classList.remove('survey__rating-buttons__button_selected');
                });
            this.#parent
                .querySelector('.survey__question').textContent = this.#config.questions.question[id + 1];
            this.#parent
                .querySelector('.survey__min-rating-grad').textContent = this.#config.questions.bad[id + 1];
            this.#parent
                .querySelector('.survey__max-rating-grad').textContent = this.#config.questions.good[id + 1];
        }
    }


    addListeners() {
        this.#parent
            .querySelectorAll('.survey__rating-buttons__button').forEach((star) => {
                star.addEventListener('click', (e) => this.handleCheckbox(e, star.dataset.id));
            });
        this.#parent
            .querySelector('.survey__close-button')
            .addEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.survey__send-button')
            .addEventListener('click', this.handleSend);
        mediator.on('changeStar', this.handleStarResponse);
        mediator.on('sendStat', this.handleNext);
    }

    removeListeners() {
        this.#parent
            .querySelectorAll('.survey__rating-buttons__button').forEach((star) => {
                star.removeEventListener('click', (e) => this.handleCheckbox(e, star.dataset.id));
            });
        this.#parent
            .querySelector('.survey__close-button')
            .removeEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.survey__send-button')
            .removeEventListener('click', this.handleSend);
        mediator.off('changeStar', this.handleStarResponse);
        mediator.off('sendStat', this.handleNext);
    }

    handleStarResponse() {
        stars = statStore.raiting;
        if (stars >= 1) {
            const star1 = this.#parent
                .querySelector('#rating-1');
            star1.classList.add('survey__rating-buttons__button_selected')
        }
        if (stars >= 2) {
            const star2 = this.#parent
                .querySelector('#rating-2');
            star2.classList.add('survey__rating-buttons__button_selected')
        }
        if (stars >= 3) {
            const star3 = this.#parent
                .querySelector('#rating-3');
            star3.classList.add('survey__rating-buttons__button_selected')
        }
        if (stars >= 4) {
            const star4 = this.#parent
                .querySelector('#rating-4');
            star4.classList.add('survey__rating-buttons__button_selected')
        }
        if (stars >= 5) {
            const star5 = this.#parent
                .querySelector('#rating-5');
            star5.classList.add('survey__rating-buttons__button_selected')
        }
    }
}
