import Menu from '../../components/menu/menu.js';
import Header from '../../components/header/header.js';
import dispathcher from '../../modules/dispathcher.js';
import mediator from '../../modules/mediator.js';
import { actionLogout, actionRedirect, actionUpdateEmail, actionDeleteEmail } from '../../actions/userActions.js';
import template from './letter.hbs'
import router from '../../modules/router.js';
import userStore from '../../stores/userStore.js';


//const MAX_INPUT_LENGTH = 64;


/**
 * Класс обертки страницы
 * @class
 */
export default class Letter {
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
        const config = this.#config;
        this.#config.menu.component = new Menu(this.#parent, this.#config.menu);
        const elements = {
            status: this.#config.email.readStatus,
            avatar: this.#config.email.photoId,
            from: this.#config.email.senderEmail,
            subject: this.#config.email.topic,
            text: this.#config.email.text,
            date: (new Date(this.#config.email.dateOfDispatch)).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),


            id: this.#config.email.id,
            replyId: this.#config.email.replyToEmailId,
            replyTopic: this.#config.replyEmail?.topic,
            userLetter: this.#config.email.senderEmail.charAt(0),
            header: new Header(null, config.header).render(),
            menu: this.#config.menu.component.render(),
        };
        if (elements.from === userStore.body.login) {
            elements.from = this.#config.email.recipientEmail;
        }
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    hideError = () => {
        const oldError = this.#parent
            .querySelector('.letter__error');
        oldError.classList.remove('appear');
    };

    handleStat = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/stat', true));
    };

    handleDropdowns(e) {
        const target = e.target;

        const elements = {
            profile: {
                button: document.querySelector('.header__avatar'),
                dropdown: document.querySelector('.header__dropdown'),
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

    /**
     * Функция авторизации
     */
    handleExit = async (e) => {
        e.preventDefault();
        await dispathcher.do(actionLogout());
    };

    handleProfile = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/profile', true));
    };

    handleResend = (e) => {
        e.preventDefault();
        const topic = this.#parent
            .querySelector('.letter__subject').textContent.trim();
        const sender = this.#parent
            .querySelector('.letter__info__from').textContent.trim();
        const date = this.#parent
            .querySelector('.letter__info__date').textContent.trim();
        const text = this.#parent
            .querySelector('.letter__text').textContent.trim();
        dispathcher.do(actionRedirect('/write_letter', true, { topic: topic, sender: sender, date: date, text: text }));
    };

    handleReply = (e) => {
        e.preventDefault();
        const topic = this.#parent
            .querySelector('.letter__subject').textContent.trim();
        const sender = this.#parent
            .querySelector('.letter__info__from').textContent.trim();
        const date = this.#parent
            .querySelector('.letter__info__date').textContent.trim();
        const text = this.#parent
            .querySelector('.letter__text').textContent.trim();
        dispathcher.do(actionRedirect('/write_letter', true, { topic: topic, sender: sender, date: date, text: text, replyId: this.#config.email.id, replySender: this.#config.email.senderEmail }));
    };

    handleStatus = async (e) => {
        this.hideError();
        e.preventDefault();
        const id = this.#config.email.id;
        const value = this.#config.email;
        const icon = document.querySelector('.letter__info__icon');

        if (icon.src.endsWith("/icons/read-on-offer__256.svg")) {
            icon.src = '/icons/read-on__256.svg';
        } else {
            icon.src = '/icons/read-on-offer__256.svg';
        };
        value.readStatus = !value.readStatus;
        dispathcher.do(actionUpdateEmail(id, value));
    }

    handleMarkAsRead = async (e) => {
        this.hideError();
        e.preventDefault();
        const id = this.#config.email.id;
        const value = this.#config.email;
        const icon = document.querySelector('.letter__info__icon');
        if (value.readStatus === false) {
            value.readStatus = true;
            icon.src = '/icons/read-on-offer__256.svg';
            dispathcher.do(actionUpdateEmail(id, value));
        }
    }

    handleMarkAsUnread = async (e) => {
        this.hideError();
        e.preventDefault();
        const id = this.#config.email.id;
        const value = this.#config.email;
        const icon = document.querySelector('.letter__info__icon');
        if (value.readStatus === true) {
            value.readStatus = false;
            icon.src = '/icons/read-on__256.svg';
            dispathcher.do(actionUpdateEmail(id, value));
        }
    }

    handleDelete = async (e) => {
        this.hideError();
        e.preventDefault();
        const id = this.#config.email.id;
        this.handleBack(e);
        dispathcher.do(actionDeleteEmail(id));
    }

    handleBack = async (e) => {
        e.preventDefault();
        if (router.canGoBack() > 1) {
            window.history.back();
        }
        document
            .querySelector('.letter__header__back-button')
            .removeEventListener('click', this.handleBack);
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#config.menu.component.addListeners();
        this.#parent
            .querySelector('.letter__info__icon')
            .addEventListener('click', this.handleStatus);
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .addEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.header__dropdown__profile-button')
            .addEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('#delete')
            .addEventListener('click', this.handleDelete);
        this.#parent
            .querySelector('.header__dropdown__stat-button')
            .addEventListener('click', this.handleStat);
        this.#parent
            .querySelector('#mark-as-read')
            .addEventListener('click', this.handleMarkAsRead);
        this.#parent
            .querySelector('#mark-as-unread')
            .addEventListener('click', this.handleMarkAsUnread);
        this.#parent
            .querySelector('#resend')
            .addEventListener('click', this.handleResend);
        this.#parent
            .querySelector('#reply')
            .addEventListener('click', this.handleReply);
        this.#parent.
            querySelector('.letter__header__back-button')
            .addEventListener('click', this.handleBack);
        this.#parent.addEventListener('click', this.handleDropdowns);
        mediator.on('logout', this.handleExitResponse);
        mediator.on('updateEmail', this.handleUpdateEmailResponse);
        mediator.on('deleteEmail', this.handleDeleteEmailResponse);

    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#config.menu.component.removeListeners();
        this.#parent
            .querySelector('.letter__info__icon')
            .removeEventListener('click', this.handleStatus);
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .removeEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.header__dropdown__profile-button')
            .removeEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('#delete')
            .removeEventListener('click', this.handleDelete);
        this.#parent
            .querySelector('#mark-as-read')
            .removeEventListener('click', this.handleMarkAsRead);
        this.#parent
            .querySelector('.header__dropdown__stat-button')
            .removeEventListener('click', this.handleStat);
        this.#parent
            .querySelector('#mark-as-unread')
            .removeEventListener('click', this.handleMarkAsUnread);
        this.#parent
            .querySelector('#resend')
            .removeEventListener('click', this.handleResend);
        this.#parent
            .querySelector('#reply')
            .removeEventListener('click', this.handleReply);
        this.#parent.
            querySelector('.letter__header__back-button')
            .removeEventListener('click', this.handleBack);
        this.#parent.removeEventListener('click', this.handleDropdowns);
        mediator.off('logout', this.handleExitResponse);
        mediator.off('updateEmail', this.handleUpdateEmailResponse);
        mediator.off('deleteEmail', this.handleDeleteEmailResponse);
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

    handleUpdateEmailResponse = (status) => {
        switch (status) {
            case 200:
                break;
            default:
                const error = this.#parent.querySelector('.letter__error');
                error.textContent = 'Проблема на нашей стороне, уже исправляем';
                error.classList.add('appear');
                break;
        }
    }

    handleDeleteEmailResponse = (status) => {
        switch (status) {
            case 200:
                break;
            default:
                const error = this.#parent.querySelector('.letter__error');
                error.textContent = 'Проблема на нашей стороне, уже исправляем';
                error.classList.add('appear');
                break;
        }
    }
}
