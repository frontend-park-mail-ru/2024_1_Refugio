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

        const emailInput = document.querySelector('#email');
        const passwordInput = document.querySelector('#password');

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        let oldError = this.#parent
            .querySelector('#login__input__error-email');
        if (oldError) {
            oldError.classList.remove('show');
        }
        oldError = this.#parent
            .querySelector('#login__input__error-password');
        if (oldError) {
            oldError.classList.remove('show');
        }
        oldError = this.#parent
            .querySelector('#login__button_error');
        if (oldError) {
            oldError.classList.remove('show');
        }

        let err = false;

        if (!email) {
            const error = this.#parent
                .querySelector('#login__input__error-email');
            error.textContent = 'Введите имя ящика';
            error.classList.add('show');
            err = true;
        }

        if (!password) {
            const error = this.#parent
                .querySelector('#login__input__error-password');
            error.textContent = 'Введите пароль';
            error.classList.add('show');
            err = true;
        }

        const emailRegex = /^[a-zA-Z0-9\._-]+@[a-z0-9-]+\.[a-z]+$/;
        if (!emailRegex.test(email)) {
            const error = this.#parent
                .querySelector('#email-error');
            error.textContent = 'Email не содержит @ и . или использует недопустимые символы';
            error.classList.add('show');
            err = true;
        }
        if (email.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('#email-error');
            error.textContent = 'Email должен быть меньше 65 символов';
            error.classList.add('show');
            err = true;
        }

        const passwordRegex = /^[a-zA-Z0-9`~!@#$%^&*(),\.;'\[\]<>?:"{}|\\\/]+$/;
        if (!passwordRegex.test(password)) {
            const error = this.#parent
                .querySelector('#password-error');
            error.textContent = "В пароле только латинские буквы и символы:`~!@#$%^&*(),.;'[]<>?:\"{}|\/\\";
            error.classList.add('show');
            err = true;
        }
        if (password.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('#password-error');
            error.textContent = "Пароль должен быть меньше 65 символов";
            error.classList.add('show');
            err = true;
        }
        if (!email) {
            const error = this.#parent
                .querySelector('#email-error');
            error.textContent = 'Поле должно быть заполнено';
            error.classList.add('show');
            err = true;
        }

        if (!password) {
            const error = this.#parent
                .querySelector('#password-error');
            error.textContent = 'Поле должно быть заполнено';
            error.classList.add('show');
            err = true;
        }
        if (err) {
            return;
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
            console.log(response.text());
            // registration successful
            const main = new MainView();
            await main.renderPage();
        } else {
            const errorSign = this.#parent
                .querySelector('#button-error');
            errorSign.classList.add('show');
            errorSign.textContent = 'Такого пользователя не существует или неверно указан пароль';

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