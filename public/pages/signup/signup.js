import Signup_Box from "../../components/signup-box/signup-box.js";
import ajax from "../../modules/ajax.js";
import LoginView from "../../views/login.js";

/**
 * Класс обертки страницы
 * @class
 */
export default class Signup {
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
        const template = Handlebars.templates['signup.hbs'];
        const elements = {
            signup_box: new Signup_Box(null, this.#config).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    /**
     * Функция регистрации
     */
    handleSignup = async (e) => {
        e.preventDefault();


        const nameInput = document.querySelector('.signup-container__input[type="text"][placeholder="Имя"]');
        const surnameInput = document.querySelector('.signup-container__input[type="text"][placeholder="Фамилия"]');
        const emailInput = document.querySelector('.signup-container__input[type="email"]');
        const passwordInput = document.querySelector('.signup-container__input[type="password"][placeholder="Пароль"]');
        const passwordConfirmationInput = document.querySelector('.signup-container__input[type="password"][placeholder="Повторите пароль"]');


        const name = nameInput.value.trim();
        const surname = surnameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const passwordConfirmation = passwordConfirmationInput.value.trim();

        if (!name || !surname || !email || !password || !passwordConfirmation) {

            const error = this.#parent
                .querySelector('.signup-container__error-sign');
            error.textContent = "Все поля должны быть заполнены";
            error.classList.add('signup-container__error-sign_show');
            return
        }

        if (email.indexOf('@') === -1) {
            const error = this.#parent
                .querySelector('.signup-container__error-sign');
            error.textContent = "Некорректный ввод адреса почты";
            error.classList.add('signup-container__error-sign_show');
            return
        }

        if (password !== passwordConfirmation) {
            const error = this.#parent
                .querySelector('.signup-container__error-sign');
            error.textContent = "Пароли не совпадают";
            error.classList.add('signup-container__error-sign_show');
            return
        }


        // create JSON object with user data
        const newUser = {
            login: email,
            name: name,
            password: password,
            surname: surname,

        };

        const response = await ajax(
            'POST', 'http://89.208.223.140:8080/api/v1/signup', JSON.stringify(newUser), 'application/json'
        );

        if (response.ok) {
            // registration successful
            const login = new LoginView();
            login.renderPage();
        }
    }

    /**
     * Функция рендера страницы авторизации
     */
    renderLogin = async (e) => {
        e.preventDefault();

        const loginView = new LoginView();

        loginView.renderPage();
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#parent
            .querySelector('.signup-container__signup-btn')
            .addEventListener('click', this.handleSignup);

        this.#parent
            .querySelector('.signup-container__login-ref')
            .addEventListener('click', this.renderLogin);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent
            .querySelector('.signup-container__signup-btn')
            .addEventListener('click', this.handleSignup);

        this.#parent
            .querySelector('.signup-container__login-ref')
            .addEventListener('click', this.renderLogin);

    }
}