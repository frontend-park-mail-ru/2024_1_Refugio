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

        const firstNameInput = document.querySelector('.signup__first-name__input');
        const lastNameInput = document.querySelector('.signup__last-name__input');
        const birthdayDay = document.querySelector('.signup__birthday__input__day__value-img p').textContent;
        const birthdayMonth = document.querySelector('.signup__birthday__input__month__value-img p').textContent;
        const birthdayYear = document.querySelector('.signup__birthday__input__year__value-img p').textContent;
        const genderInput = document.querySelector('.cl-switch input')
        const emailInput = document.querySelector('.signup__email__input');
        const passwordInput = document.querySelector('.signup__password__input');
        const passwordConfirmInput = document.querySelector('.signup__password-confirm__input');

        const monthIndex = ['Январь', 'Февраль', "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"].indexOf(birthdayMonth);

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const birthday = new Date(birthdayYear, monthIndex, birthdayDay);

        const gender = genderInput.checked ? 'female' : 'male';
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;

        let oldError = this.#parent
            .querySelector('.signup__first-name__error');
        oldError.classList.remove('show');
        oldError = firstNameInput;
        oldError.classList.remove('auth__input-backgroud-error');

        oldError = this.#parent
            .querySelector('.signup__last-name__error');
        oldError.classList.remove('show');
        oldError = lastNameInput;
        oldError.classList.remove('auth__input-backgroud-error');

        oldError = this.#parent
            .querySelector('.signup__email__error');
        oldError.classList.remove('show');
        oldError = emailInput;
        oldError.classList.remove('auth__input-backgroud-error');

        oldError = this.#parent
            .querySelector('.signup__password__error');
        oldError.classList.remove('show');
        oldError = passwordInput;
        oldError.classList.remove('auth__input-backgroud-error');

        oldError = this.#parent
            .querySelector('.signup__password-confirm__error');
        oldError.classList.remove('show');
        oldError = passwordConfirmInput;
        oldError.classList.remove('auth__input-backgroud-error');

        oldError = this.#parent
            .querySelector('.signup__button__error');
        oldError.classList.remove('show');

        if (!firstName) {
            const error = this.#parent
                .querySelector('.signup__first-name__error');
            error.textContent = 'Введите имя';
            error.classList.add('show');
            firstNameInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (!lastName) {
            const error = this.#parent
                .querySelector('.signup__last-name__error');
            error.textContent = 'Введите фамилию';
            error.classList.add('show');
            lastNameInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (!email) {
            const error = this.#parent
                .querySelector('.signup__email__error');
            error.textContent = 'Введите имя ящика';
            error.classList.add('show');
            emailInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (!password) {
            const error = this.#parent
                .querySelector('.signup__password__error');
            error.textContent = 'Введите пароль';
            error.classList.add('show');
            passwordInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (!passwordConfirm) {
            const error = this.#parent
                .querySelector('.signup__password-confirm__error');
            error.textContent = 'Введите пароль ещё раз';
            error.classList.add('show');
            passwordConfirmInput.classList.add('auth__input-backgroud-error');
            return;
        }



        if (firstName.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.signup__first-name__error');
            error.textContent = 'Слишком длинное имя';
            error.classList.add('show');
            firstNameInput.classList.add('auth__input-backgroud-error');
            return;
        }
        if (lastName.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.signup__last-name__error');
            error.textContent = 'Слишком длинная фамилия';
            error.classList.add('show');
            lastNameInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (email.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.signup__email__error');
            error.textContent = 'Слишком длинное имя ящика';
            error.classList.add('show');
            emailInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (password.length > 4 * MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.signup__password__error');
            error.textContent = 'Слишком длинный пароль';
            error.classList.add('show');
            passwordInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (passwordConfirm.length > 4 * MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.signup__password-confirm__error');
            error.textContent = 'Слишком длинный пароль';
            error.classList.add('show');
            passwordConfirmInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (email.indexOf('@') === -1) {
            const error = this.#parent
                .querySelector('.signup__email__error');
            error.textContent = 'Забыли "@"';
            error.classList.add('show');
            emailInput.classList.add('auth__input-backgroud-error');
            return
        }

        if (email.indexOf('.') === -1) {
            const error = this.#parent
                .querySelector('.signup__email__error');
            error.textContent = 'Забыли "."';
            error.classList.add('show');
            emailInput.classList.add('auth__input-backgroud-error');
            return
        }

        const emailSignupRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailSignupRegex.test(email)) {
            const error = this.#parent
                .querySelector('.signup__email__error');
            error.textContent = 'Некорректное имя ящика';
            error.classList.add('show');
            emailInput.classList.add('auth__input-backgroud-error');
            return
        }

        if (password.length < 8) {
            const error = this.#parent
                .querySelector('.signup__password__error');
            error.textContent = 'Минимальная длина 8 символов';
            error.classList.add('show');
            passwordInput.classList.add('auth__input-backgroud-error');
            return
        }

        const passwordRegex = /^[a-zA-Z0-9`~`!@#$%^&*()-=_+,.;'\[\]<>?:"{}|\\\/]+$/;
        if (!passwordRegex.test(password)) {
            const error = this.#parent
                .querySelector('.signup__password__error');
            error.textContent = 'Недопустимые символы';
            error.classList.add('show');
            passwordInput.classList.add('auth__input-backgroud-error');
            return
        }


        if (password !== passwordConfirm) {
            const error = this.#parent
                .querySelector('.signup__password-confirm__error');
            error.textContent = 'Пароли не совпадают';
            error.classList.add('show');
            passwordConfirmInput.classList.add('auth__input-backgroud-error');
            return
        }

        // create JSON object with user data
        const newUser = {
            login: email,
            name: firstName,
            password: password,
            surname: lastName,
            gender: gender,
            birthday: birthday
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
        if (this.checked) {
            document.querySelector('.signup__gender__select__female').classList.remove('signup__gender__select__passive');
            document.querySelector('.signup__gender__select__male').classList.add('signup__gender__select__passive');
        } else {
            document.querySelector('.signup__gender__select__male').classList.remove('signup__gender__select__passive');
            document.querySelector('.signup__gender__select__female').classList.add('signup__gender__select__passive');
        }
    }

    handleDropdowns(e) {
        const target = event.target;

        if (document.querySelector('.signup__birthday__input__day__value-img') === null) { return; }

        const elements = {
            day: {
                button: document.querySelector('.signup__birthday__input__day__value-img'),
                dropdown: document.querySelector('.dropdown__wrapper__day'),
            },
            month: {
                button: document.querySelector('.signup__birthday__input__month__value-img'),
                dropdown: document.querySelector('.dropdown__wrapper__month'),

            },
            year: {
                button: document.querySelector('.signup__birthday__input__year__value-img'),
                dropdown: document.querySelector('.dropdown__wrapper__year'),
            },
        }

        const hideAllDropdowns = () => {
            Object.values(elements).forEach(value => {
                value.dropdown.classList.remove('show__dropdown__wrapper');
                value.dropdown.classList.add('hide__dropdown__wrapper');
            });
        }

        let hasTarget = false;
        Object.keys(elements).forEach(key => {
            if (elements[key].button.contains(target)) {
                hasTarget = true;
                let showDropdown = true;
                if (elements[key].dropdown.classList.contains('show__dropdown__wrapper')) {
                    showDropdown = false;
                }
                hideAllDropdowns();
                if (showDropdown) {
                    elements[key].dropdown.classList.remove('hide__dropdown__wrapper');
                    elements[key].dropdown.classList.add('show__dropdown__wrapper');
                }
            }
        })

        if (elements.day.dropdown.contains(target) && target.tagName === 'P') {
            document.querySelector('.signup__birthday__input__day__value-img p').textContent = target.textContent;

        } else {
            if (elements.month.dropdown.contains(target) && target.tagName === 'P') {
                document.querySelector('.signup__birthday__input__month__value-img p').textContent = target.textContent;

            } else {
                if (elements.year.dropdown.contains(target) && target.tagName === 'P') {
                    document.querySelector('.signup__birthday__input__year__value-img p').textContent = target.textContent;
                }
            }

        }
        if (!hasTarget) {
            hideAllDropdowns();
        }
    };

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#parent
            .querySelector('.signup__button')
            .addEventListener('click', this.handleSignup);

        this.#parent
            .querySelector('.signup__switch-authorization-method__passive')
            .addEventListener('click', this.renderLogin);
        this.#parent
            .querySelector('.cl-switch input')
            .addEventListener('change', this.handleCheckbox);

        this.#parent
        document.addEventListener('click', this.handleDropdowns);
        mediator.on('signup', this.handleSignupResponse);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent
            .querySelector('.signup__button')
            .addEventListener('click', this.handleSignup);

        this.#parent
            .querySelector('.signup__switch-authorization-method__passive')
            .addEventListener('click', this.renderLogin);
        this.#parent
            .querySelector('.cl-switch input')
            .addEventListener('change', this.handleCheckbox);
        this.#parent
        document.addEventListener('click', this.handleDropdowns);
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
