import Login_Box from '../../components/login-box/login-box.js';

import ajax from '../../modules/ajax.js';

import SignupView from "../../views/signup.js";

import MainView from '../../views/main.js';

/**
 * Класс обертки страницы
 * @class
 */
export default class Login {
    #parent
    #config

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
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#parent
            .querySelector('.login-container__login-btn')
            .addEventListener('click', (async (e) => {

                e.preventDefault();

                const emailInput = document.querySelector('.login-container__input[type="email"]');
                const passwordInput = document.querySelector('.login-container__input[type="password"][placeholder="Пароль"]');

                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();

                if( !email || !password) {
                    const error = this.#parent
                        .querySelector('.login-container__error-sign');
                    error.textContent = "Все поля должны быть заполнены";
                    error.classList.add('login-container__error-sign_show');
                    return
                }
                if (email.indexOf('@') === -1) {
                    const error = this.#parent
                        .querySelector('.login-container__error-sign');
                    error.textContent = "Некорректный ввод адреса почты";
                    error.classList.add('login-container__error-sign_show');
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
                        .querySelector('.login-container__error-sign');
                    errorSign.classList.add('login-container__error-sign_show');
                    errorSign.textContent = "Логин и пароль некорректны";

                }
            }));

        this.#parent
            .querySelector('.login-container__signup-ref')
            .addEventListener('click', (e) => {
                e.preventDefault();

                const signupView = new SignupView();

                signupView.renderPage();

            });

    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent
            .querySelector('.login-container__login-btn')
            .removeEventListener('click', (async (e) => {

                e.preventDefault();

                const emailInput = document.querySelector('.login-container__input[type="email"]');
                const passwordInput = document.querySelector('.login-container__input[type="password"][placeholder="Пароль"]');

                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();



                // create JSON object with user data
                const newUser = {
                    login: email,
                    password: password,
                };

                const response = await ajax(
                    'POST', 'http://89.208.223.140:8080/api/v1/login', JSON.stringify(newUser), 'application/json'
                );


            }));

        this.#parent
            .querySelector('.login-container__signup-ref')
            .addEventListener('click', (e) => {
                e.preventDefault();

                const signupView = new SignupView();

                signupView.renderPage();

            });

    }


}