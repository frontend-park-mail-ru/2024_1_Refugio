import Login_Box from '../../components/login-box/login-box.js';
import mediator from '../../modules/mediator.js';
import dispathcher from '../../modules/dispathcher.js';
import { actionLogin, actionRedirect } from '../../actions/userActions.js';

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
        let oldError = this.#parent
            .querySelector('.login-container__error-email');
        oldError.classList.remove('login-container__error-sign_show');
        oldError = this.#parent
            .querySelector('.login-container__error-password');
        oldError.classList.remove('login-container__error-sign_show');
        oldError = this.#parent
            .querySelector('.login-container__error-sign');
        oldError.classList.remove('login-container__error-sign_show');
        let err = false;


        const emailRegex = /^[a-zA-Z0-9\._-]+@[a-z0-9-]+\.[a-z]+$/;
        if (!emailRegex.test(email)) {
            const error = this.#parent
                .querySelector('.login-container__error-email');
            error.textContent = 'Email не содержит @ и . или использует недопустимые символы';
            error.classList.add('login-container__error-sign_show');
            err = true;
        }
        if (email.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.login-container__error-email');
            error.textContent = 'Email должен быть меньше 65 символов';
            error.classList.add('login-container__error-sign_show');
            err = true;
        }

        const passwordRegex = /^[a-zA-Z0-9`~!@#$%^&*(),\.;'\[\]<>?:"{}|\\\/]+$/;
        if (!passwordRegex.test(password)) {
            const error = this.#parent
                .querySelector('.login-container__error-password');
            error.textContent = "В пароле только латинские буквы и символы:`~!@#$%^&*(),.;'[]<>?:\"{}|\/\\";
            error.classList.add('login-container__error-sign_show');
            err = true;
        }
        if (password.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.login-container__error-password');
            error.textContent = "Пароль должен быть меньше 65 символов";
            error.classList.add('login-container__error-sign_show');
            err = true;
        }
        if (!email) {
            const error = this.#parent
                .querySelector('.login-container__error-email');
            error.textContent = 'Поле должно быть заполнено';
            error.classList.add('login-container__error-sign_show');
            err = true;
        }

        if (!password) {
            const error = this.#parent
                .querySelector('.login-container__error-password');
            error.textContent = 'Поле должно быть заполнено';
            error.classList.add('login-container__error-sign_show');
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

        await dispathcher.do(actionLogin(newUser));
    };

    /**
     * Функция рендера страницы регистрации
     */
    renderSignup = async (e) => {

        e.preventDefault();

        dispathcher.do(actionRedirect('/signup', true));
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

        mediator.on('login', this.handleLoginResponse);
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

        mediator.off('login', this.handleLoginResponse);
    }

    handleLoginResponse = (status) => {
        switch (status) {
            case 200:
                dispathcher.do(actionRedirect('/main', true));
                break;
            case 401:
                const errorSign = this.#parent
                    .querySelector('.login-container__error-sign');
                errorSign.textContent = 'Такого пользователя не существует или неверно указан пароль';
                errorSign.classList.add('login-container__error-sign_show');
                break;
            default:
                break;
        }
    }
}
