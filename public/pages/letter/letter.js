import Menu from '../../components/menu/menu.js';
import Header from '../../components/header/header.js';
import dispathcher from '../../modules/dispathcher.js';
import mediator from '../../modules/mediator.js';
import { actionLogout, actionRedirect, actionUpdateEmail, actionDeleteEmail } from '../../actions/userActions.js';
import template from './letter.hbs'
import router from '../../modules/router.js';


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
            menu: new Menu(null, config.menu).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

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

    handleMain = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/main', true));
    };

    handleWriteLetter = (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/write_letter', true));
    };

    handleResend = (e) => {
        e.preventDefault();
        const topic = this.#parent
            .querySelector('.letter__subject').textContent
        const sender = this.#parent
            .querySelector('.letter__info__from').textContent
        const date = this.#parent
            .querySelector('.letter__info__date').textContent
        const text = this.#parent
            .querySelector('.letter__text').textContent
        dispathcher.do(actionRedirect('/write_letter', true, { topic: topic, sender: sender, date: date, text: text }));
    };

    handleReply = (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/write_letter', true, { replyId: this.#config.email.id, replySender: this.#config.email.senderEmail }));
    };

    handleSent = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/sent', true));
    };

    handleStatus = async (e) => {
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
            .querySelector('.menu__write-letter-button')
            .addEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('#delete')
            .addEventListener('click', this.handleDelete);
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
        this.#parent
            .querySelector('#incoming-folder')
            .addEventListener('click', this.handleMain);
        this.#parent.
            querySelector('.header__logo')
            .addEventListener('click', this.handleMain);
        this.#parent.
            querySelector('.letter__header__back-button')
            .addEventListener('click', this.handleBack);

        this.#parent
            .querySelector('#sent-folder')
            .addEventListener('click', this.handleSent);
        this.#parent.addEventListener('click', this.handleDropdowns);
        mediator.on('logout', this.handleExitResponse);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
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
            .querySelector('.menu__write-letter-button')
            .removeEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('#resend')
            .removeEventListener('click', this.handleResend);
        this.#parent
            .querySelector('#reply')
            .removeEventListener('click', this.handleReply);
        this.#parent
            .querySelector('#incoming-folder')
            .removeEventListener('click', this.handleMain);
        this.#parent.
            querySelector('.header__logo')
            .removeEventListener('click', this.handleMain);
        this.#parent.
            querySelector('.letter__header__back-button')
            .removeEventListener('click', this.handleMain);

        this.#parent
            .querySelector('#sent-folder')
            .removeEventListener('click', this.handleSent);
        this.#parent.removeEventListener('click', this.handleDropdowns);
        mediator.off('logout', this.handleExitResponse);
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
}
