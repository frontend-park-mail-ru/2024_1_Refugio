import Menu from '../../components/menu/menu.js';
import Header from '../../components/header/header.js';
import dispathcher from '../../modules/dispathcher.js';
import mediator from '../../modules/mediator.js';
import { actionLogout, actionRedirect } from '../../actions/userActions.js';


const MAX_INPUT_LENGTH = 64;


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
        const template = Handlebars.templates['letter.hbs'];
        const config = this.#config;
        const elements = {
            status: this.#config.email.readStatus,
            avatar: this.#config.email.photoId,
            from: this.#config.email.senderEmail,
            subject: this.#config.email.topic,
            text: this.#config.email.text,
            date: this.#config.email.dateOfDispatch,
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
                console.log(showDropdown);
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
            .querySelector('.letter__content__body__subject span').textContent
        const sender = this.#parent
            .querySelector('#sender').textContent
        const date = this.#parent
            .querySelector('#date').textContent
        const text = this.#parent
            .querySelector('.letter__content__body__text p').textContent
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
            .querySelector('.menu__write-letter__button')
            .addEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('#resend')
            .addEventListener('click', this.handleResend);
        this.#parent
            .querySelector('#reply')
            .addEventListener('click', this.handleReply);
        this.#parent
            .querySelector('.menu__incoming__button')
            .addEventListener('click', this.handleMain);
        this.#parent.
            querySelector('.header__logo')
            .addEventListener('click', this.handleMain);
        this.#parent.
            querySelector('.letter__content__header__back-button')
            .addEventListener('click', this.handleMain);

        this.#parent
            .querySelector('.menu__sent__button')
            .addEventListener('click', this.handleSent);
        this.#parent.addEventListener('click', this.handleDropdowns);
        mediator.on('logout', this.handleExitResponse);
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
            .querySelector('.menu__write-letter__button')
            .removeEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('#resend')
            .removeEventListener('click', this.handleResend);
        this.#parent
            .querySelector('#reply')
            .removeEventListener('click', this.handleReply);
        this.#parent
            .querySelector('.menu__incoming__button')
            .removeEventListener('click', this.handleMain);
        this.#parent.
            querySelector('.header__logo')
            .removeEventListener('click', this.handleMain);
        this.#parent.
            querySelector('.letter__content__header__back-button')
            .removeEventListener('click', this.handleMain);
        this.#parent
            .querySelector('.menu__sent__button')
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
