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

        const emailInput = document.querySelector('.login-container__input[type="email"]');
        const passwordInput = document.querySelector('.login-container__input[type="password"][placeholder="Пароль"]');

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            const error = this.#parent
                .querySelector('.login-container__error-sign');
            error.textContent = 'Все поля должны быть заполнены';
            error.classList.add('login-container__error-sign_show');
            return;
        }

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(email)) {
            const error = this.#parent
                .querySelector('.login-container__error-sign');
            error.textContent = 'Email не содержит @ и . или использует недопустимые символы';
            error.classList.add('login-container__error-sign_show');
            return;
        }
        if (email.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.login-container__error-sign');
            error.textContent = 'Email должен быть меньше 65 символов';
            error.classList.add('login-container__error-sign_show');
            return;
        }

        const passwordRegex = /^[a-zA-Z0-9`~!@#$%^&*(),.;'\[\]<>?:"{}|\\\/]+$/;
        if (!passwordRegex.test(password)) {
            const error = this.#parent
                .querySelector('.login-container__error-sign');
            error.textContent = 'В пароле только латинские буквы и символы:`~!@#$%^&*(),.;\'[]<>?:"{}|\/\\';
            error.classList.add('login-container__error-sign_show');
            return;
        }
        if (password.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.login-container__error-sign');
            error.textContent = 'Пароль должен быть меньше 65 символов';
            error.classList.add('login-container__error-sign_show');
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
                .querySelector('.login-container__error-sign');
            errorSign.classList.add('login-container__error-sign_show');
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
            .querySelector('.login-container__login-btn')
            .addEventListener('click', this.handleLogin);

        this.#parent
            .querySelector('.login-container__signup-ref')
            .addEventListener('click', this.renderSignup);

    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent
            .querySelector('.login-container__login-btn')
            .removeEventListener('click', this.handleLogin);

        this.#parent
            .querySelector('.login-container__signup-ref')
            .addEventListener('click', this.renderSignup);

    }

}