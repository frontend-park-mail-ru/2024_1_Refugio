import { actionRedirect, actionSignup } from '../../actions/userActions.js';
import Signup_Box from '../../components/signup-box/signup-box.js';
import dispathcher from '../../modules/dispathcher.js';
import mediator from '../../modules/mediator.js';

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
        const dateInput = document.querySelector('.signup-container__input[type="date"]');
        const emailInput = document.querySelector('.signup-container__input[type="email"]');
        const passwordInput = document.querySelector('.signup-container__input[type="password"][placeholder="Пароль"]');
        const passwordConfirmationInput = document.querySelector('.signup-container__input[type="password"][placeholder="Повторите пароль"]');


        const name = nameInput.value.trim();
        const surname = surnameInput.value.trim();
        const date = dateInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const passwordConfirmation = passwordConfirmationInput.value;
        const dateParsed = new Date(date);

        let oldError = this.#parent
            .querySelector('.signup-container__error-email');
        oldError.classList.remove('signup-container__error-sign_show');
        oldError = this.#parent
            .querySelector('.signup-container__error-name');
        oldError.classList.remove('signup-container__error-sign_show');
        oldError = this.#parent
            .querySelector('.signup-container__error-surname');
        oldError.classList.remove('signup-container__error-sign_show');
        oldError = this.#parent
            .querySelector('.signup-container__error-date');
        oldError.classList.remove('signup-container__error-sign_show');
        oldError = this.#parent
            .querySelector('.signup-container__error-password');
        oldError.classList.remove('signup-container__error-sign_show');
        oldError = this.#parent
            .querySelector('.signup-container__error-repeat');
        oldError.classList.remove('signup-container__error-sign_show');
        oldError = this.#parent
            .querySelector('.signup-container__error-sign');
        oldError.classList.remove('signup-container__error-sign_show');
        let err = false;

        if (name.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.signup-container__error-name');
            error.textContent = 'Имя должно быть меньше 65 символов';
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }

        if (surname.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.signup-container__error-surname');
            error.textContent = 'Фамилия должна быть меньше 65 символов';
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }

        let today = new Date();
        if (dateParsed.getTime() > today.getTime()) {
            const error = this.#parent
                .querySelector('.signup-container__error-date');
            error.textContent = 'Введите реальную дату';
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }
        if (dateParsed.getFullYear() < 1900) {
            const error = this.#parent
                .querySelector('.signup-container__error-date');
            error.textContent = 'Введите дату после 1900';
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(email)) {
            const error = this.#parent
                .querySelector('.signup-container__error-email');
            error.textContent = 'Адрес должен содержать только латинские буквы и символы ._-';
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }
        if (email.indexOf('@') === 0 || email.indexOf('@') === -1 || email.indexOf('.') === -1 ||
            email.indexOf('.') - email.indexOf('@') === 1 || email.indexOf('.') === email.length - 1) {
            const error = this.#parent
                .querySelector('.signup-container__error-email');
            error.textContent = 'Адрес должен иметь вид: name@mail.ru';
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }
        if (email.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.signup-container__error-email');
            error.textContent = 'Адрес должен быть меньше 65 символов';
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }

        const passwordRegex = /^[a-zA-Z0-9`~!@#$%^&*(),\.;'\[\]<>?:"{}|\\\/]+$/;
        if (!passwordRegex.test(password)) {
            const error = this.#parent
                .querySelector('.signup-container__error-password');
            error.textContent = "Допускаются только латинские буквы, цифры и символы:`~!@#$%^&*(),.;'[]<>?:\"{}|\/\\";
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }
        if (password.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.signup-container__error-password');
            error.textContent = "Пароль должен быть меньше 65 символов";
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }
        if (password.length < 8) {
            const error = this.#parent
                .querySelector('.signup-container__error-password');
            error.textContent = "Пароль должен быть больше 7 символов";
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }

        if (password !== passwordConfirmation) {
            const error = this.#parent
                .querySelector('.signup-container__error-repeat');
            error.textContent = 'Пароли не совпадают';
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }

        if (!name) {
            const error = this.#parent
                .querySelector('.signup-container__error-name');
            error.textContent = 'Заполните поле';
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }

        if (!surname) {
            const error = this.#parent
                .querySelector('.signup-container__error-surname');
            error.textContent = 'Заполните поле';
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }

        if (!date) {
            const error = this.#parent
                .querySelector('.signup-container__error-date');
            error.textContent = 'Поле должно быть заполнено';
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }

        if (!email) {
            const error = this.#parent
                .querySelector('.signup-container__error-email');
            error.textContent = 'Поле должно быть заполнено';
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }

        if (!password) {
            const error = this.#parent
                .querySelector('.signup-container__error-password');
            error.textContent = 'Поле должно быть заполнено';
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }

        if (!passwordConfirmation) {
            const error = this.#parent
                .querySelector('.signup-container__error-repeat');
            error.textContent = 'Поле должно быть заполнено';
            error.classList.add('signup-container__error-sign_show');
            err = true;
        }
        if (err) {
            return;
        }

        // create JSON object with user data
        const newUser = {
            login: email,
            name: name,
            password: password,
            surname: surname,

        };

        dispathcher.do(actionSignup(newUser));
    };

    /**
     * Функция рендера страницы авторизации
     */
    renderLogin = async (e) => {
        e.preventDefault();

        dispathcher.do(actionRedirect('/login', true));
    };

    handleCheckbox(e) {
        e.preventDefault();
        document.querySelector('.signup-container__woman').style.color = this.checked ? "#EDEDED" : "#757575";
        document.querySelector('.signup-container__man').style.color = this.checked ? "#757575" : "#EDEDED";
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
        this.#parent
            .querySelector('.signup-container__checkbox')
            .addEventListener('change', this.handleCheckbox, false);
        mediator.on('signup', this.handleSignupResponse);
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
        this.#parent
            .querySelector('.signup-container__checkbox')
            .addEventListener('change', this.handleCheckbox);
        mediator.off('signup', this.handleSignupResponse);
    }

    handleSignupResponse = (status) => {
        switch (status) {
            case 200:
                dispathcher.do(actionRedirect('/login', true));
                break;
            default:
                const error = this.#parent
                    .querySelector('.signup-container__error-sign');
                error.textContent = 'Проблемы на нашей стороне. Уже исправляем!';
                error.classList.add('signup-container__error-sign_show');
                break;
        }
    }
}