import Signup_Box from '../../components/signup-box/signup-box.js';
import ajax from '../../modules/ajax.js';
import LoginView from '../../views/login.js';

const MAX_INPUT_LENGTH = 64;

/**
 * Класс обертки страницы
 * @class
 */
export default class Signup {
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
        const password = passwordInput.value;
        const passwordConfirmation = passwordConfirmationInput.value;

        if (!name || !surname || !email || !password || !passwordConfirmation) {
            const error = this.#parent
                .querySelector('.signup-container__error-sign');
            error.textContent = 'Все поля должны быть заполнены';
            error.classList.add('signup-container__error-sign_show');
            return;
        }


        if (name.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.signup-container__error-sign');
            error.textContent = 'Максимальная длина 64 символа';
            error.classList.add('signup-container__error-sign_show');
            return;
        }

        if (surname.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.signup-container__error-sign');
            error.textContent = 'Максимальная длина 64 символа';
            error.classList.add('signup-container__error-sign_show');
            return;
        }

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
            .querySelector('.signup-container__error-sign');
            error.textContent = 'Максимальная длина 64';
            error.classList.add('signup-container__error-sign_show');
            return;
        }
        if (email.indexOf('@') === -1) {
            const error = this.#parent
            .querySelector('.signup-container__error-sign');
            error.textContent = 'Забыли "@"';
            error.classList.add('signup-container__error-sign_show');
            return;
        }
        if (email.indexOf('.') === -1) {
            const error = this.#parent
                .querySelector('.signup-container__error-sign');
            error.textContent = 'Забыли "."';
            error.classList.add('signup-container__error-sign_show');
            return;
        }
        if (!emailRegex.test(email)) {
            const error = this.#parent
                .querySelector('.signup-container__error-sign');
            error.textContent = 'Некорректный формат адреса';
            error.classList.add('signup-container__error-sign_show');
            return;
        }

        const passwordRegex = /^[a-zA-Z0-9`~!@#$%^&*(),.;'\[\]<>?:"{}|\\\/]+$/;
        if (!passwordRegex.test(password)) {
            const error = this.#parent
                .querySelector('.signup-container__error-sign');
            error.textContent = "В пароле только латинские буквы и символы:`~!@#$%^&*(),.;'[]<>?:\"{}|\/\\";
            error.classList.add('signup-container__error-sign_show');
            return;
        }
        if (password.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.signup-container__error-sign');
            error.textContent = "Пароль должен быть меньше 65 символов";
            error.classList.add('signup-container__error-sign_show');
            return;
        }
        if (password.length < 8) {
            const error = this.#parent
                .querySelector('.signup-container__error-sign');
            error.textContent = "Пароль должен быть больше 7 символов";
            error.classList.add('signup-container__error-sign_show');
            return;
        }

        if (password !== passwordConfirmation) {
            const error = this.#parent
                .querySelector('.signup-container__error-sign');
            error.textContent = 'Пароли не совпадают';
            error.classList.add('signup-container__error-sign_show');
            return;
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
    };

    /**
     * Функция рендера страницы авторизации
     */
    renderLogin = async (e) => {
        e.preventDefault();

        const loginView = new LoginView();

        loginView.renderPage();
    };

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