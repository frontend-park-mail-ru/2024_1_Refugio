import Menu from '../../components/menu/menu.js';
import Header from '../../components/header/header.js';
import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionRedirect, actionSend, actionUpdateEmail } from '../../actions/userActions.js';
import mediator from '../../modules/mediator.js';
import template from './write-letter.hbs'
import router from '../../modules/router.js';



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

    registerHelper(text) {
        let lines = text.split('\n');
        lines = lines.map(line => '\t' + line);
        return lines.join('\n');
    };


    /**
     * Рендер компонента в DOM
     */
    render() {
        const config = this.#config;
        this.#config.menu.component = new Menu(this.#parent, this.#config.menu);
        const elements = {
            id: this.#config.values?.id,
            resend: this.#config.values?.resend,
            changeDraft: this.#config.values?.changeDraft,
            sender: this.#config.values?.sender,
            date: this.#config.values?.date,
            topic: this.#config.values?.topic,
            text: this.#config.values?.text,
            replyId: this.#config.values?.replyId,
            replySender: this.#config.values?.replySender,
            header: new Header(null, config.header).render(),
            menu: this.#config.menu.component.render(),
        };
        if (this.#config.values?.text && !this.#config.values?.changeDraft) {
            elements.text = this.registerHelper(this.#config.values?.text);
        }
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

    handleStat = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/stat', true));
    };

    handleDraft = async (e) => {
        e.preventDefault();
        const toInput = document.querySelector('.write-letter__to__input');
        const topicInput = document.querySelector('.write-letter__subject__input');
        const textInput = document.querySelector('.write-letter__text');

        const to = toInput.value.trim();
        let topic = topicInput.value.trim();
        let text = textInput.value.trim();

        let oldError = this.#parent
            .querySelector('.write-letter__to__error');
        oldError.classList.remove('appear');
        oldError = toInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('.write-letter__subject__error');
        oldError.classList.remove('appear');
        oldError = topicInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('.write-letter__buttons__error');
        oldError.classList.remove('show');

        let isValidForm = true;
        const toError = this.#parent.querySelector('.write-letter__to__error');
        if (!to) {
            toError.textContent = "Введите получателя";
            toError.classList.add('appear');
            toInput.classList.add('input-background-error');
            isValidForm = false;
        } else {
            if (to.length > MAX_INPUT_LENGTH) {
                toError.textContent = "Слишком длинное имя ящика получателя";
                toError.classList.add('appear');
                toInput.classList.add('input-background-error');
                isValidForm = false;
            } else {
                if (to.indexOf('@') === -1) {
                    toError.textContent = "Забыли \"@\"";
                    toError.classList.add('appear');
                    toInput.classList.add('input-background-error');
                    isValidForm = false;
                } else {
                    if (to.indexOf('.') === -1) {
                        toError.textContent = "Забыли \".\"";
                        toError.classList.add('appear');
                        toInput.classList.add('input-background-error');
                        isValidForm = false;
                    } else {
                        const toRegex = /^[a-zA-Z0-9._%+-]+@mailhub.su$/;
                        if (!toRegex.test(to)) {
                            toError.textContent = "Некорректное имя ящика получателя";
                            toError.classList.add('appear');
                            toInput.classList.add('input-background-error');
                            isValidForm = false;
                        }
                    }
                }
            }
        }

        if (!isValidForm) {
            return;
        }

        if (!topic) {
            topic = "Без темы";
        }

        if (!text) {
            text = "Пустое письмо";
        }

        const newLetter = {
            readStatus: false,
            topic: topic,
            text: text,
            recipientEmail: to,
            senderEmail: this.#config.user.login,
            draftStatus: true,
        };
        if (this.#config.values?.replyId) {
            console.log(this.#config.values.replyId);
            newLetter.replyToEmailId = this.#config.values.replyId;
        }
        dispathcher.do(actionSend(newLetter));
    };


    handleSend = async (e) => {
        e.preventDefault();
        const toInput = document.querySelector('.write-letter__to__input');
        const topicInput = document.querySelector('.write-letter__subject__input');
        const textInput = document.querySelector('.write-letter__text');

        const to = toInput.value.trim();
        let topic = topicInput.value.trim();
        let text = textInput.value.trim();

        let oldError = this.#parent
            .querySelector('.write-letter__to__error');
        oldError.classList.remove('appear');
        oldError = toInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('.write-letter__subject__error');
        oldError.classList.remove('appear');
        oldError = topicInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('.write-letter__buttons__error');
        oldError.classList.remove('show');

        // oldError = this.#parent
        //     .querySelector('.write-letter__attachments__error');
        // oldError.classList.remove('show');

        let isValidForm = true;
        const toError = this.#parent.querySelector('.write-letter__to__error');
        if (!to) {
            toError.textContent = "Введите получателя";
            toError.classList.add('appear');
            toInput.classList.add('input-background-error');
            isValidForm = false;
        } else {
            if (to.length > MAX_INPUT_LENGTH) {
                toError.textContent = "Слишком длинное имя ящика получателя";
                toError.classList.add('appear');
                toInput.classList.add('input-background-error');
                isValidForm = false;
            } else {
                if (to.indexOf('@') === -1) {
                    toError.textContent = "Забыли \"@\"";
                    toError.classList.add('appear');
                    toInput.classList.add('input-background-error');
                    isValidForm = false;
                } else {
                    if (to.indexOf('.') === -1) {
                        toError.textContent = "Забыли \".\"";
                        toError.classList.add('appear');
                        toInput.classList.add('input-background-error');
                        isValidForm = false;
                    } else {
                        const toRegex = /^[a-zA-Z0-9._%+-]+@.+\..+$/;
                        if (!toRegex.test(to)) {
                            toError.textContent = "Некорректное имя ящика получателя";
                            toError.classList.add('appear');
                            toInput.classList.add('input-background-error');
                            isValidForm = false;
                        }
                    }
                }
            }
        }

        const topicError = this.#parent.querySelector('.write-letter__subject__error');
        if (topic.length > MAX_INPUT_LENGTH) {
            topicError.textContent = "Слишком длинная тема";
            topicError.classList.add('appear');
            topicInput.classList.add('input-background-error');
            isValidForm = false;
        }

        if (!isValidForm) {
            return;
        }

        if (!topic) {
            topic = "Без темы";
        }

        if (!text) {
            text = "Пустое письмо";
        }


        const newLetter = {
            readStatus: false,
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

    handleDraftUpdate = async (e) => {
        e.preventDefault();
        const toInput = document.querySelector('.write-letter__to__input');
        const topicInput = document.querySelector('.write-letter__subject__input');
        const textInput = document.querySelector('.write-letter__text');

        const to = toInput.value.trim();
        let topic = topicInput.value.trim();
        let text = textInput.value.trim();

        let oldError = this.#parent
            .querySelector('.write-letter__to__error');
        oldError.classList.remove('appear');
        oldError = toInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('.write-letter__subject__error');
        oldError.classList.remove('appear');
        oldError = topicInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('.write-letter__buttons__error');
        oldError.classList.remove('show');

        let isValidForm = true;
        const toError = this.#parent.querySelector('.write-letter__to__error');
        if (!to) {
            toError.textContent = "Введите получателя";
            toError.classList.add('appear');
            toInput.classList.add('input-background-error');
            isValidForm = false;
        } else {
            if (to.length > MAX_INPUT_LENGTH) {
                toError.textContent = "Слишком длинное имя ящика получателя";
                toError.classList.add('appear');
                toInput.classList.add('input-background-error');
                isValidForm = false;
            } else {
                if (to.indexOf('@') === -1) {
                    toError.textContent = "Забыли \"@\"";
                    toError.classList.add('appear');
                    toInput.classList.add('input-background-error');
                    isValidForm = false;
                } else {
                    if (to.indexOf('.') === -1) {
                        toError.textContent = "Забыли \".\"";
                        toError.classList.add('appear');
                        toInput.classList.add('input-background-error');
                        isValidForm = false;
                    } else {
                        const toRegex = /^[a-zA-Z0-9._%+-]+@mailhub.su$/;
                        if (!toRegex.test(to)) {
                            toError.textContent = "Некорректное имя ящика получателя";
                            toError.classList.add('appear');
                            toInput.classList.add('input-background-error');
                            isValidForm = false;
                        }
                    }
                }
            }
        }

        if (!isValidForm) {
            return;
        }

        if (!topic) {
            topic = "Без темы";
        }

        if (!text) {
            text = "Пустое письмо";
        }

        const newLetter = {
            readStatus: false,
            topic: topic,
            text: text,
            recipientEmail: to,
            senderEmail: this.#config.user.login,
            draftStatus: true,
        };
        if (this.#config.values?.replyId) {
            console.log(this.#config.values.replyId);
            newLetter.replyToEmailId = this.#config.values.replyId;
        }
        dispathcher.do(actionUpdateEmail(this.#config.values?.id, newLetter));
    };


    handleSendUpdate = async (e) => {
        e.preventDefault();
        const toInput = document.querySelector('.write-letter__to__input');
        const topicInput = document.querySelector('.write-letter__subject__input');
        const textInput = document.querySelector('.write-letter__text');

        const to = toInput.value.trim();
        let topic = topicInput.value.trim();
        let text = textInput.value.trim();

        let oldError = this.#parent
            .querySelector('.write-letter__to__error');
        oldError.classList.remove('appear');
        oldError = toInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('.write-letter__subject__error');
        oldError.classList.remove('appear');
        oldError = topicInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('.write-letter__buttons__error');
        oldError.classList.remove('show');

        // oldError = this.#parent
        //     .querySelector('.write-letter__attachments__error');
        // oldError.classList.remove('show');

        let isValidForm = true;
        const toError = this.#parent.querySelector('.write-letter__to__error');
        if (!to) {
            toError.textContent = "Введите получателя";
            toError.classList.add('appear');
            toInput.classList.add('input-background-error');
            isValidForm = false;
        } else {
            if (to.length > MAX_INPUT_LENGTH) {
                toError.textContent = "Слишком длинное имя ящика получателя";
                toError.classList.add('appear');
                toInput.classList.add('input-background-error');
                isValidForm = false;
            } else {
                if (to.indexOf('@') === -1) {
                    toError.textContent = "Забыли \"@\"";
                    toError.classList.add('appear');
                    toInput.classList.add('input-background-error');
                    isValidForm = false;
                } else {
                    if (to.indexOf('.') === -1) {
                        toError.textContent = "Забыли \".\"";
                        toError.classList.add('appear');
                        toInput.classList.add('input-background-error');
                        isValidForm = false;
                    } else {
                        const toRegex = /^[a-zA-Z0-9._%+-]+@mailhub.su$/;
                        if (!toRegex.test(to)) {
                            toError.textContent = "Некорректное имя ящика получателя";
                            toError.classList.add('appear');
                            toInput.classList.add('input-background-error');
                            isValidForm = false;
                        }
                    }
                }
            }
        }

        const topicError = this.#parent.querySelector('.write-letter__subject__error');
        if (topic.length > MAX_INPUT_LENGTH) {
            topicError.textContent = "Слишком длинная тема";
            topicError.classList.add('appear');
            topicInput.classList.add('input-background-error');
            isValidForm = false;
        }

        if (!isValidForm) {
            return;
        }

        if (!topic) {
            topic = "Без темы";
        }

        if (!text) {
            text = "Пустое письмо";
        }


        const newLetter = {
            readStatus: false,
            topic: topic,
            text: text,
            recipientEmail: to,
            senderEmail: this.#config.user.login,
        };
        if (this.#config.values?.replyId) {
            console.log(this.#config.values.replyId);
            newLetter.replyToEmailId = this.#config.values.replyId;
        }
        dispathcher.do(actionUpdateEmail(this.#config.values?.id, newLetter));
    };

    handleDropdowns(e) {
        const target = e.target;

        const elements = {
            profile: {
                button: document.querySelector('.header__avatar'),
                dropdown: document.querySelector('.header__dropdown'),
            },
            files: {
                button: document.querySelector('.write-letter__attachments__view-button'),
                dropdown: document.querySelector('.write-letter__attachments__dropdown__wrapper'),
            }
        }

        const hideAllDropdowns = () => {
            Object.values(elements).forEach(value => {
                value.dropdown.classList.remove('show');
            });
        }

        let hasTarget = false;
        Object.keys(elements).forEach(key => {
            if (elements[key].button.contains(target)) {
                hasTarget = true;
                let showDropdown = true;
                if (elements[key].dropdown.classList.contains('show')) {
                    showDropdown = false;
                }
                hideAllDropdowns();
                if (showDropdown) {
                    elements[key].dropdown.classList.add('show');
                }
            }
        })
        if (!hasTarget) {
            hideAllDropdowns();
        }
    }

    handleBack = async (e) => {
        e.preventDefault();
        if (router.canGoBack() > 1) {
            window.history.back();
        }
        document
            .querySelector('.write-letter__buttons__cancel-button')
            .removeEventListener('click', this.handleBack);
    }

    handleRollUpMenu = (e) => {
        e.preventDefault();
        const menu = document.querySelector('.menu');
        if (menu.classList.contains('appear')) {
            menu.classList.remove('appear');
        } else {
            menu.classList.add('appear');
        }
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {

        this.#parent
            .querySelector('.header__rollup-button')
            .addEventListener('click', this.handleRollUpMenu);

        this.#config.menu.component.addListeners();
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .addEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.header__dropdown__profile-button')
            .addEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('.header__dropdown__stat-button')
            .addEventListener('click', this.handleStat);
        this.#parent
            .querySelector('.write-letter__buttons__cancel-button')
            .addEventListener('click', this.handleBack);
        if (this.#config.values?.changeDraft) {
            this.#parent
                .querySelector('.write-letter__buttons__send-button')
                .addEventListener('click', this.handleSendUpdate);
            this.#parent
                .querySelector('.write-letter__buttons__save-draft-button')
                .addEventListener('click', this.handleDraftUpdate);
        } else {
            this.#parent
                .querySelector('.write-letter__buttons__send-button')
                .addEventListener('click', this.handleSend);
            this.#parent
                .querySelector('.write-letter__buttons__save-draft-button')
                .addEventListener('click', this.handleDraft);
        }
        this.#parent.addEventListener('click', this.handleDropdowns);
        mediator.on('logout', this.handleExitResponse)
        mediator.on('send', this.handleSendResponse)
        mediator.on('updateEmail', this.handleSendResponse)
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#config.menu.component.removeListeners();
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .removeEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.header__dropdown__profile-button')
            .removeEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('.header__dropdown__stat-button')
            .removeEventListener('click', this.handleStat);
        this.#parent
            .querySelector('.write-letter__buttons__cancel-button')
            .removeEventListener('click', this.handleBack);
        if (this.#config.values?.changeDraft) {
            this.#parent
                .querySelector('.write-letter__buttons__send-button')
                .removeEventListener('click', this.handleSendUpdate);
            this.#parent
                .querySelector('.write-letter__buttons__save-draft-button')
                .removeEventListener('click', this.handleDraftUpdate);
        } else {
            this.#parent
                .querySelector('.write-letter__buttons__send-button')
                .removeEventListener('click', this.handleSend);
            this.#parent
                .querySelector('.write-letter__buttons__save-draft-button')
                .removeEventListener('click', this.handleDraft);
        }
        this.#parent.removeEventListener('click', this.handleDropdowns);
        mediator.off('logout', this.handleExitResponse)
        mediator.off('send', this.handleSendResponse)
        mediator.off('updateEmail', this.handleSendResponse)
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
                    .querySelector('.write-letter__buttons__error');

                error.textContent = 'Проблема на нашей стороне. Уже исправляем';
                error.classList.add('show');
                break;
        }
    }
}
