import { actionRedirect, actionSignup } from '../../actions/userActions.js';
import Signup_Box from '../../components/signup-box/signup-box.js';
import dispathcher from '../../modules/dispathcher.js';
import mediator from '../../modules/mediator.js';
import template from './signup.hbs'

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

        const firstNameInput = document.querySelector('.signup-box__first-name-input-wrapper__input');
        const lastNameInput = document.querySelector('.signup-box__last-name-input-wrapper__input');
        const birthdayDay = document.querySelector('.birthday__input__day__value-img p').textContent;
        const birthdayMonth = document.querySelector('.birthday__input__month__value-img p').textContent;
        const birthdayYear = document.querySelector('.birthday__input__year__value-img p').textContent;
        const genderInput = document.querySelector('.cl-switch input')
        const emailInput = document.querySelector('.signup-box__email-input-wrapper__email-input');
        const passwordInput = document.querySelector('.signup-box__password-input-wrapper__input');
        const passwordConfirmInput = document.querySelector('.signup-box__password-confirm-input-wrapper__input');

        const monthIndex = ['Январь', 'Февраль', "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"].indexOf(birthdayMonth);

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const birthday = new Date(birthdayYear, monthIndex, birthdayDay, 12);
        const birthdayString = birthday.toISOString();

        const gender = genderInput.checked ? 'Female' : 'Male';
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;

        const emailDomainInput = this.#parent
            .querySelector('.signup-box__email-input-wrapper__email-domain-input');
        let oldError = this.#parent
            .querySelector('#first-name-error');
        oldError.classList.remove('show');
        oldError = firstNameInput;
        oldError.classList.remove('input-background-error');
        oldError = this.#parent
            .querySelector('#last-name-error');
        oldError.classList.remove('show');
        oldError = lastNameInput;
        oldError.classList.remove('input-background-error');
        oldError = this.#parent
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
            .querySelector('#password-confirm-error');
        oldError.classList.remove('show');
        oldError = passwordConfirmInput;
        oldError.classList.remove('input-background-error');
        oldError = this.#parent
            .querySelector('#signup-error');
        oldError.classList.remove('show');


        let isValidForm = true;
        const firstNameError = this.#parent
            .querySelector('#first-name-error');
        if (!firstName) {
            firstNameError.textContent = "Введите имя";
            firstNameError.classList.add('show');
            firstNameInput.classList.add('input-background-error');
            isValidForm = false;

        } else {
            if (firstName.length > MAX_INPUT_LENGTH) {
                firstNameError.textContent = "Слишком длинное имя";
                firstNameError.classList.add('show');
                firstNameInput.classList.add('input-background-error');
                isValidForm = false;
            }
        }

        const lastNameError = this.#parent
            .querySelector('#last-name-error');
        if (!lastName) {
            lastNameError.textContent = "Введите фамилию";
            lastNameError.classList.add('show');
            lastNameInput.classList.add('input-background-error');
            isValidForm = false;
        } else {
            if (lastName.length > MAX_INPUT_LENGTH) {
                lastNameError.textContent = "Слишком длинная фамилия";
                lastNameError.classList.add('show');
                lastNameInput.classList.add('input-background-error');
                isValidForm = false;
            }
        }

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
            } else {
                if (password.length < 8) {
                    passwordError.textContent = 'Минимальная длина 8 символов';
                    passwordError.classList.add('show');
                    passwordInput.classList.add('input-background-error');
                    isValidForm = false;
                } else {
                    const passwordRegex = /^[a-zA-Z0-9`~`!@#$%^&*()-=_+,.;'\[\]<>?:"{}|\\\/]+$/;
                    if (!passwordRegex.test(password)) {
                        passwordError.textContent = 'Недопустимые символы';
                        passwordError.classList.add('show');
                        passwordInput.classList.add('input-background-error');
                        isValidForm = false;
                    }
                }
            }
        }

        const passwordConfirmError = this.#parent
            .querySelector('#password-confirm-error');
        if (!passwordConfirm) {
            passwordConfirmError.textContent = 'Введите пароль';
            passwordConfirmError.classList.add('show');
            passwordConfirmInput.classList.add('input-background-error');
            isValidForm = false;
        } else {
            if (password !== passwordConfirm) {
                passwordConfirmError.textContent = 'Пароли не совпадают';
                passwordConfirmError.classList.add('show');
                passwordConfirmInput.classList.add('input-background-error');
                isValidForm = false;
            }
        }

        const dateError = this.#parent
            .querySelector('#signup-error');
        if (birthday > new Date()) {
            dateError.textContent = 'Дата рождения превосходит сегодняшнее число';
            dateError.classList.add('show');
            isValidForm = false;
        } else if (([1, 3, 5, 8 ,10].includes(monthIndex) && Number(birthdayDay) === 31) || (monthIndex===1 && Number(birthdayDay) === 30)) {
            dateError.textContent = 'В этом месяце нет такого числа';
            dateError.classList.add('show');
            isValidForm = false;
        } else if (monthIndex===1 && Number(birthdayDay) === 29 && birthday.getMonth() !== 1) {
            dateError.textContent = 'В этом месяце в невисокосном году нет такого числа';
            dateError.classList.add('show');
            isValidForm = false;
        }

        if (!isValidForm) {
            return;
        }

        // create JSON object with user data
        const newUser = {
            login: email + "@mailhub.su",
            firstname: firstName,
            password: password,
            surname: lastName,
            gender: gender,
            birthday: birthdayString,
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
        console.log(this);

        e.preventDefault();
        if (this.checked) {
            document.querySelector('.gender-select_female').classList.remove('gender-select_passive');
            document.querySelector('.gender-select_male').classList.add('gender-select_passive');
        } else {
            document.querySelector('.gender-select_male').classList.remove('gender-select_passive');
            document.querySelector('.gender-select_female').classList.add('gender-select_passive');
        }
    }

    handleDropdowns(e) {
        const target = e.target;

        if (document.querySelector('.birthday__input__day__value-img') === null) { return; }

        const elements = {
            day: {
                button: document.querySelector('.birthday__input__day__value-img'),
                dropdown: document.querySelector('.dropdown__wrapper__day'),
            },
            month: {
                button: document.querySelector('.birthday__input__month__value-img'),
                dropdown: document.querySelector('.dropdown__wrapper__month'),

            },
            year: {
                button: document.querySelector('.birthday__input__year__value-img'),
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
            document.querySelector('.birthday__input__day__value-img p').textContent = target.textContent;

        } else {
            if (elements.month.dropdown.contains(target) && target.tagName === 'P') {
                document.querySelector('.birthday__input__month__value-img p').textContent = target.textContent;

            } else {
                if (elements.year.dropdown.contains(target) && target.tagName === 'P') {
                    document.querySelector('.birthday__input__year__value-img p').textContent = target.textContent;
                }
            }

        }
        if (!hasTarget) {
            hideAllDropdowns();
        }
    }

    handleEnterKey = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            this.handleSignup(e);
        }
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#parent
            .querySelector('.signup-box__signup-button-wrapper__button')
            .addEventListener('click', this.handleSignup);

        this.#parent
            .querySelector('.signup-box__authorization-method-switch__method_passive')
            .addEventListener('click', this.renderLogin);
        this.#parent
            .querySelector('.cl-switch input')
            .addEventListener('change', this.handleCheckbox);

        this.#parent
        document.addEventListener('click', this.handleDropdowns);
        document
            .addEventListener('keydown', this.handleEnterKey);
        mediator.on('signup', this.handleSignupResponse);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent
            .querySelector('.signup-box__signup-button-wrapper__button')
            .removeEventListener('click', this.handleSignup);

        this.#parent
            .querySelector('.signup-box__authorization-method-switch__method_passive')
            .removeEventListener('click', this.renderLogin);
        this.#parent
            .querySelector('.cl-switch input')
            .removeEventListener('change', this.handleCheckbox);

        this.#parent
        document.removeEventListener('click', this.handleDropdowns);
        document
            .removeEventListener('keydown', this.handleEnterKey);
        mediator.off('signup', this.handleSignupResponse);
    }

    handleSignupResponse = (status) => {
        const error = this.#parent
            .querySelector('#signup-error');
        switch (status) {
            case 200:
                dispathcher.do(actionRedirect('/login', true));
                break;
            default:
                error.textContent = 'Проблемы на нашей стороне. Уже исправляем!';
                error.classList.add('show');
                break;
        }
    }
}
