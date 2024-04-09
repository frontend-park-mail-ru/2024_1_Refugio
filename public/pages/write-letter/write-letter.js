import Menu from '../../components/menu/menu.js';
import Header from '../../components/header/header.js';
import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionRedirect, actionSend } from '../../actions/userActions.js';
import mediator from '../../modules/mediator.js';


const MAX_INPUT_LENGTH = 64;


/**
 * Класс обертки страницы
 * @class
 */
export default class Write__Letter {
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
    render() {
        const template = Handlebars.templates['write-letter.hbs'];
        const config = this.#config;

        const elements = {
            sender: this.#config.values?.sender,
            date: this.#config.values?.date,
            topic: this.#config.values?.topic,
            text: this.#config.values?.text,
            replyId: this.#config.values?.replyId,
            replySender: this.#config.values?.replySender,
            header: new Header(null, config.header).render(),
            menu: new Menu(null, config.menu).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    /**
     * Функция авторизации
     */

    handleSaveForm = async (e) => {
        e.preventDefault();

    };

    /**
     * Функция вызова logout действия
     */
    handleExit = async (e) => {
        e.preventDefault();
        await dispathcher.do(actionLogout());
    };

    handleProfile = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/profile', true));
    };

    handleMain = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/main', true));
    };

    handleSend = async (e) => {
        e.preventDefault();
        const toInput = document.querySelector('.write__letter__content__header__to__input');
        const topicInput = document.querySelector('.write__letter__content__header__subject__input');
        const textInput = document.querySelector('.write__letter__content__text__textarea');

        const to = toInput.value.trim();
        const topic = topicInput.value.trim();
        const text = textInput.value.trim();

        let oldError = this.#parent
            .querySelector('.write__letter__content__header__to__error');
        oldError.classList.remove('show');
        oldError.classList.add('remove');
        oldError = toInput;
        oldError.classList.remove('auth__input-backgroud-error');

        oldError = this.#parent
            .querySelector('.write__letter__content__header__subject__error');
        oldError.classList.remove('show');
        oldError.classList.add('remove');
        oldError = topicInput;
        oldError.classList.remove('auth__input-backgroud-error');

        oldError = this.#parent
            .querySelector('.write__letter__content__header__attachments__error');
        oldError.classList.remove('show');
        oldError.classList.add('remove');

        if (!to) {
            const error = this.#parent
                .querySelector('.write__letter__content__header__to__error');
            error.textContent = 'Введите получателя';
            error.classList.remove('remove');
            error.classList.add('show');
            toInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (!topic) {
            const error = this.#parent
                .querySelector('.write__letter__content__header__subject__error');
            error.textContent = 'Введите тему';
            error.classList.remove('remove');
            error.classList.add('show');
            topicInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (topic.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.write__letter__content__header__subject__error');
            error.textContent = 'Слишком длинная тема';
            error.classList.remove('remove');
            error.classList.add('show');
            topicInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (to.indexOf('@') === -1) {
            const error = this.#parent
                .querySelector('.write__letter__content__header__to__error');
            error.textContent = 'Забыли "@"';
            error.classList.remove('remove');
            error.classList.add('show');
            toInput.classList.add('auth__input-backgroud-error');
            return
        }

        if (to.indexOf('.') === -1) {
            const error = this.#parent
                .querySelector('.write__letter__content__header__to__error');
            error.textContent = 'Забыли "."';
            error.classList.remove('remove');
            error.classList.add('show');
            toInput.classList.add('auth__input-backgroud-error');
            return
        }

        const emailSignupRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailSignupRegex.test(to)) {
            const error = this.#parent
                .querySelector('.write__letter__content__header__to__error');
            error.textContent = 'Некорректное имя ящика';
            error.classList.remove('remove');
            error.classList.add('show');
            toInput.classList.add('auth__input-backgroud-error');
            return
        }

        // create JSON object with user data
        const newLetter = {
            readStatus: true,
            topic: topic,
            text: text,
            recipientEmail: to,
            senderEmail: this.#config.user.login,
        };
        if (this.#config.values?.replyId) {
            console.log(this.#config.values.replyId);
            newLetter.replyToEmailId = this.#config.values.replyId;
        }
        dispathcher.do(actionSend(newLetter));
    };

    handleDropdowns(e) {
        const target = e.target;

        const elements = {
            profile: {
                button: document.querySelector('.header__avatar-img'),
                dropdown: document.querySelector('.dropdown__wrapper__profile-menu'),
            }
        }

        const hideAllDropdowns = () => {
            Object.values(elements).forEach(value => {
                value.dropdown.classList.remove('show__dropdown__wrapper');
                value.dropdown.classList.add('hide__dropdown__wrapper');
            });
        }

        let hasTarget = false;
        Object.keys(elements).forEach(key => {
            if (elements[key].button.contains(target)) {
                hasTarget = true;
                let showDropdown = true;
                if (elements[key].dropdown.classList.contains('show__dropdown__wrapper')) {
                    showDropdown = false;
                }
                hideAllDropdowns();
                if (showDropdown) {
                    elements[key].dropdown.classList.remove('hide__dropdown__wrapper');
                    elements[key].dropdown.classList.add('show__dropdown__wrapper');
                }
            }
        })
        if (!hasTarget) {
            hideAllDropdowns();
        }
    };

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#parent
            .querySelector('.dropdown__profile-menu__logout__button')
            .addEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.dropdown__profile-menu__profile__button')
            .addEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('.menu__incoming__button')
            .addEventListener('click', this.handleMain);
        this.#parent
            .querySelector('.write__letter__content__process-buttons__send-button')
            .addEventListener('click', this.handleSend);
        this.#parent.addEventListener('click', this.handleDropdowns);
        mediator.on('logout', this.handleExitResponse)
        mediator.on('send', this.handleSendResponse)
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent
            .querySelector('.dropdown__profile-menu__logout__button')
            .removeEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.dropdown__profile-menu__profile__button')
            .removeEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('.menu__incoming__button')
            .removeEventListener('click', this.handleMain);
        this.#parent.removeEventListener('click', this.handleDropdowns);
        mediator.off('logout', this.handleExitResponse);
        mediator.off('send', this.handleSendResponse);
    }

    handleExitResponse = (status) => {
        switch (status) {
            case 200:
                dispathcher.do(actionRedirect('/login', true));
                break;
            default:
                break;
        }
    }

    handleSendResponse = (status) => {
        switch (status) {
            case 200:
                dispathcher.do(actionRedirect('/main', true));
                break;
            default:
                const error = this.#parent
                    .querySelector('.write__letter__content__header__attachments__error');
                error.textContent = 'Проблемы на нашей стороне. Уже исправляем!';
                error.classList.add('show');
                error.classList.remove('remove');
                break;
        }
    }
}
