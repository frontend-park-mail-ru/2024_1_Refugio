import Login_Box from '../../components/login-box/login-box.js';

import ajax from '../../modules/ajax.js';

import SignupView from '../../views/signup.js';

import MainView from '../../views/main.js';

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
        const template = Handlebars.templates['login.hbs'];
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

        const emailInput = document.querySelector('.login__email__input');
        const passwordInput = document.querySelector('.login__password__input');

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        let oldError = this.#parent
            .querySelector('.login__email__error');
        oldError.classList.remove('show');
        oldError = emailInput;
        oldError.classList.remove('auth__input-backgroud-error');
        oldError = this.#parent
            .querySelector('.login__password__error');
        oldError.classList.remove('show');
        oldError = passwordInput;
        oldError.classList.remove('auth__input-backgroud-error');
        oldError = this.#parent
            .querySelector('.login__button__error');
        oldError.classList.remove('show');

        if (!email) {
            const error = this.#parent
                .querySelector('.login__email__error');
            error.textContent = 'Введите имя ящика';
            error.classList.add('show');
            emailInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (!password) {
            const error = this.#parent
                .querySelector('.login__password__error');
            error.textContent = 'Введите пароль';
            error.classList.add('show');
            passwordInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (email.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.login__email__error');
            error.textContent = 'Слишком длинное имя ящика';
            error.classList.add('show');
            emailInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (password.length > 4 * MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.login__password__error');
            error.textContent = 'Слишком длинный пароль';
            error.classList.add('show');
            passwordInput.classList.add('auth__input-backgroud-error');
            return;
        }

        const emailLoginRegex = /^[a-zA-Z0-9!@\$%\^&\*\(\)-_=\+`~,.<>;:'"\/?\[\]{}\\\|]*$/;
        if (!emailLoginRegex.test(email)) {
            const error = this.#parent
                .querySelector('.login__email__error');
            error.textContent = 'Недопустимые символы';
            error.classList.add('show');
            emailInput.classList.add('auth__input-backgroud-error');
            return
        }

        // create JSON object with user data
        const newUser = {
            login: email,
            password: password,
        };


        const response = await ajax(
            'POST', 'http://89.208.223.140:8080/api/v1/login', JSON.stringify(newUser), 'application/json'
        );

        if (response.ok) {
            // registration successful
            const main = new MainView();
            await main.renderPage();
        } else {
            const errorSign = this.#parent
                .querySelector('.login__button__error');
            errorSign.classList.add('show');
            errorSign.textContent = 'Неверные имя ящика и/или пароль';
        }
    };

    /**
     * Функция рендера страницы регистрации
     */
    renderSignup = async (e) => {

        e.preventDefault();

        const signupView = new SignupView();

        signupView.renderPage();
    };


    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#parent
            .querySelector('.login__button')
            .addEventListener('click', this.handleLogin);

        this.#parent
            .querySelector('.login__switch-authorization-method__passive')
            .addEventListener('click', this.renderSignup);

    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent
            .querySelector('.login__button')
            .addEventListener('click', this.handleLogin);

        this.#parent
            .querySelector('.login__switch-authorization-method__passive')
            .addEventListener('click', this.renderSignup);

    }

}
