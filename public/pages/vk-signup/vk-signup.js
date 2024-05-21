import { actionRedirect, actionVkAuthSignup } from '../../actions/userActions.js';
import Vk_Signup_Box from '../../components/vk-signup-box/vk-signup-box.js';
import dispathcher from '../../modules/dispathcher.js';
import mediator from '../../modules/mediator.js';
import template from './vk-signup.hbs'

const MAX_INPUT_LENGTH = 64;

/**
 * Класс обертки страницы
 * @class
 */
export default class Vk__Signup {
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
        const elements = {
            signup_box: new Vk_Signup_Box(null, this.#config).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    /**
     * Функция регистрации
     */
    handleSignup = async (e) => {
        e.preventDefault();

        const emailInput = document.querySelector('.vk-signup-box__email-input-wrapper__email-input');
        const email = emailInput.value.trim();

        const emailDomainInput = this.#parent
            .querySelector('.vk-signup-box__email-input-wrapper__email-domain-input');
        let oldError = this.#parent
            .querySelector('#email-error');
        oldError.classList.remove('show');
        oldError = emailInput;
        oldError.classList.remove('input-background-error');
        oldError = emailDomainInput;
        oldError.classList.remove('input-background-error');
        oldError = this.#parent
            .querySelector('#vk-signup-error');
        oldError.classList.remove('show');


        let isValidForm = true;

        const emailError = this.#parent
            .querySelector('#email-error');
        if (!email) {
            emailError.textContent = 'Введите имя ящика';
            emailError.classList.add('show');
            emailInput.classList.add('input-background-error');
            emailDomainInput.classList.add('input-background-error');
            isValidForm = false;
        } else {
            if (email.length > MAX_INPUT_LENGTH) {
                emailError.textContent = 'Слишком длинное имя ящика';
                emailError.classList.add('show');
                emailInput.classList.add('input-background-error');
                emailDomainInput.classList.add('input-background-error');
                isValidForm = false;
            } else {
                const emailLoginRegex = /^[a-zA-Z0-9._%+-]+$/;
                if (!emailLoginRegex.test(email)) {
                    emailError.textContent = 'Некорректное имя ящика';
                    emailError.classList.add('show');
                    emailInput.classList.add('input-background-error');
                    emailDomainInput.classList.add('input-background-error');
                    isValidForm = false;
                }
            }
        }

        if (!isValidForm) {
            return;
        }

        const newUser = {
            // birthday: "string",
            firstname: this.#config.vkUser.firstname,
            gender: (this.#config.vkUser.gender === undefined) ? "Male" : this.#config.vkUser.gender,
            id: 0,
            login: email + "@mailhub.su",
            surname: this.#config.vkUser.surname,
            vkId: this.#config.vkUser.vkId,
        };

        dispathcher.do(actionVkAuthSignup(newUser, this.#config.authtoken));
    };

    /**
     * Функция рендера страницы авторизации
     */
    renderLogin = async (e) => {

        e.preventDefault();

        dispathcher.do(actionRedirect('/login', true));
    };

    handleEnterKey = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            this.handleSignup(e);
        }
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {

        this.#parent
            .querySelector('.vk-signup-box__signup-button-wrapper__vk-button')
            .addEventListener('click', this.handleSignup);

        this.#parent
            .querySelector('.vk-signup-box__authorization-method-switch__method_passive')
            .addEventListener('click', this.renderLogin);


        document
            .addEventListener('keydown', this.handleEnterKey);
        mediator.on('vkSignup', this.handleVkSignupResponse);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {

        this.#parent
            .querySelector('.vk-signup-box__signup-button-wrapper__vk-button')
            .removeEventListener('click', this.handleSignup);

        this.#parent
            .querySelector('.vk-signup-box__authorization-method-switch__method_passive')
            .removeEventListener('click', this.renderLogin);


        document
            .removeEventListener('keydown', this.handleEnterKey);
        mediator.off('vkSignup', this.handleVkSignupResponse);
    }

    handleVkSignupResponse = (status) => {
        const error = this.#parent
            .querySelector('#vk-signup-error');
        switch (status) {
            case 200:
                dispathcher.do(actionRedirect('/main', true));
                break;
            default:
                error.textContent = 'Проблема на нашей стороне. Уже исправляем';
                error.classList.add('show');
                break;
        }
    }
}
