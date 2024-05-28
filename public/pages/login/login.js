import Login_Box from '../../components/login-box/login-box.js';
import mediator from '../../modules/mediator.js';
import dispathcher from '../../modules/dispathcher.js';
import { actionLogin, actionRedirect, actionGetAuthUrlLoginVK, actionGetAuthUrlSignUpVK } from '../../actions/userActions.js';
import template from './login.hbs'

const MAX_INPUT_LENGTH = 64;

/**
 * Класс обертки страницы
 * @class
 */
export default class Login {
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
            login_box: new Login_Box(null, this.#config).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    /**
     * Функция авторизации
     */
    handleLogin = async (e) => {
        e.preventDefault();

        const emailInput = document.querySelector('.login-box__email-input-wrapper__email-input');
        const passwordInput = document.querySelector('.login-box__password-input-wrapper__input');

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        const emailDomainInput = this.#parent
            .querySelector('.login-box__email-input-wrapper__email-domain-input');
        let oldError = this.#parent
            .querySelector('#email-error');
        oldError.classList.remove('show');
        oldError = emailInput;
        oldError.classList.remove('input-background-error');
        oldError = emailDomainInput;
        oldError.classList.remove('input-background-error');
        oldError = this.#parent
            .querySelector('#password-error');
        oldError.classList.remove('show');
        oldError = passwordInput;
        oldError.classList.remove('input-background-error');
        oldError = this.#parent
            .querySelector('#login-error');
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

        const passwordError = this.#parent
            .querySelector('#password-error');
        if (!password) {
            passwordError.textContent = 'Введите пароль';
            passwordError.classList.add('show');
            passwordInput.classList.add('input-background-error');
            isValidForm = false;
        } else {
            if (password.length > 4 * MAX_INPUT_LENGTH) {
                passwordError.textContent = 'Слишком длинный пароль';
                passwordError.classList.add('show');
                passwordInput.classList.add('input-background-error');
                isValidForm = false;
            }
        }

        if (!isValidForm) {
            return;
        }


        // create JSON object with user data
        const newUser = {
            login: email + "@mailhub.su",
            password: password,
        };

        await dispathcher.do(actionLogin(newUser));
    };

    handleEnterKey = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            this.handleLogin(e);
        }
    }

    /**
     * Функция рендера страницы регистрации
     */
    renderSignup = async (e) => {

        e.preventDefault();

        await dispathcher.do(actionRedirect('/signup', true));
    };


    handleVkLogin = async (e) => {
        e.preventDefault();
        dispathcher.do(actionGetAuthUrlSignUpVK());
    }

    switchEye = (e) => {
        e.preventDefault();
        const input = document.querySelector('.login-box__password-input-wrapper__input');
        const eye = document.querySelector('.eye')
        if (eye.classList.contains('eye_opened')) {
            eye.src = '/icons/eye_closed.svg';
            eye.classList.remove('eye_opened')
            eye.classList.add('eye_closed');
            input.type = 'text';
            input.classList.remove('login-box__password-input-wrapper__input-password');
            input.classList.add('login-box__password-input-wrapper__input-text');
        } else {
            eye.src = '/icons/eye_opened.svg';
            eye.classList.add('eye_opened')
            eye.classList.remove('eye_closed');
            input.type = 'password';
            input.classList.add('login-box__password-input-wrapper__input-password');
            input.classList.remove('login-box__password-input-wrapper__input-text');
        }
    }

    handleEye = (e) => {
        e.preventDefault();
        const input = document.querySelector('.login-box__password-input-wrapper__input');
        if (input.value.length > 0) {
            document.querySelector('.eye').classList.remove('remove');
        } else {
            document.querySelector('.eye').classList.add('remove');
        }
    }

    handleLoginError = (e) => {
        e.preventDefault();
        const emailInput = document.querySelector('.login-box__email-input-wrapper__email-input');
        const emailDomainInput = this.#parent
            .querySelector('.login-box__email-input-wrapper__email-domain-input');
        let oldError = this.#parent
            .querySelector('#email-error');
        oldError.classList.remove('show');
        oldError = emailInput;
        oldError.classList.remove('input-background-error');
        oldError = emailDomainInput;
        oldError.classList.remove('input-background-error');
        oldError = this.#parent
            .querySelector('#login-error');
        oldError.classList.remove('show');
    }

    handlePasswordError = (e) => {
        e.preventDefault();
        const passwordInput = document.querySelector('.login-box__password-input-wrapper__input');
        let oldError = this.#parent
            .querySelector('#password-error');
        oldError.classList.remove('show');
        oldError = passwordInput;
        oldError.classList.remove('input-background-error');
        oldError = this.#parent
            .querySelector('#login-error');
        oldError.classList.remove('show');
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {

        this.#parent.
            querySelector('.login-box__email-input-wrapper__email-input')
            .addEventListener('click', this.handleLoginError);

        this.#parent.
            querySelector('.login-box__email-input-wrapper__email-domain-input')
            .addEventListener('click', this.handleLoginError);

        this.#parent.
            querySelector('.login-box__password-input-wrapper__input')
            .addEventListener('click', this.handlePasswordError);

        this.#parent.
            querySelector('.eye')
            .addEventListener('click', this.switchEye);

        this.#parent.
            querySelector('.login-box__password-input-wrapper__input')
            .addEventListener('input', this.handleEye);


        this.#parent.
            querySelector('.login-box__login-button-wrapper__vk-button')
            .addEventListener('click', this.handleVkLogin);
        this.#parent
            .querySelector('.login-box__login-button-wrapper__button')
            .addEventListener('click', this.handleLogin);
        document
            .addEventListener('keydown', this.handleEnterKey);
        this.#parent
            .querySelector('.login-box__authorization-method-switch__method_passive')
            .addEventListener('click', this.renderSignup);
        mediator.on('login', this.handleLoginResponse);
        mediator.on('getAuthUrlLoginVK', this.handleVkLoginResponse)


    }

    /**
     * Удаляет листенеры
    */
    removeListeners() {
        this.#parent.
            querySelector('.eye')
            .removeEventListener('click', this.handleEye);
        this.#parent
            .querySelector('.login-box__login-button-wrapper__button')
            .removeEventListener('click', this.handleLogin);
        document
            .removeEventListener('keydown', this.handleEnterKey);
        this.#parent
            .querySelector('.login-box__authorization-method-switch__method_passive')
            .removeEventListener('click', this.renderSignup);
        mediator.off('login', this.handleLoginResponse);
        mediator.off('getAuthUrlLoginVK', this.handleVkLoginResponse)

    }

    /**
     * Функция обработки ответа на запрос авторизации
     */
    handleLoginResponse = (status) => {
        const errorSign = this.#parent
            .querySelector('#login-error');
        const emailInput = document.querySelector('.login-box__email-input-wrapper__email-input');
        const passwordInput = document.querySelector('.login-box__password-input-wrapper__input');
        const emailDomainInput = this.#parent
            .querySelector('.login-box__email-input-wrapper__email-domain-input');
        switch (status) {
            case 200:
                dispathcher.do(actionRedirect('/main', true));
                break;
            case 401:
                errorSign.textContent = 'Неверное имя ящика и/или пароль';
                emailInput.classList.add('input-background-error');
                emailDomainInput.classList.add('input-background-error');
                passwordInput.classList.add('input-background-error');
                errorSign.classList.add('show');
                break;
            default:
                errorSign.textContent = 'Проблема на нашей стороне, уже исправляем';
                errorSign.classList.add('show');
                break;
        }
    }

    handleVkLoginResponse = (data) => {
        const error = this.#parent
            .querySelector('#login-error');
        switch (data.status) {
            case 200:
                window.location.href = data.link;
                break;
            default:
                error.textContent = 'Проблема на нашей стороне. Уже исправляем';
                error.classList.add('show');
                break;
        }
    }
}
