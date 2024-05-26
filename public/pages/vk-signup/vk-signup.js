import { actionRedirect, actionVkAuthSignup } from '../../actions/userActions.js';
import Vk_Signup_Box from '../../components/vk-signup-box/vk-signup-box.js';
import dispathcher from '../../modules/dispathcher.js';
import mediator from '../../modules/mediator.js';
import template from './vk-signup.hbs'

const MAX_INPUT_LENGTH = 64;

/**
 * Класс обертки страницы
 * @class
 */
export default class Vk__Signup {
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
            signup_box: new Vk_Signup_Box(null, this.#config).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
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
                value.dropdown.classList.remove('show');
            });
        }

        let hasTarget = false;
        Object.keys(elements).forEach(key => {
            if (elements[key].button.contains(target)) {
                hasTarget = true;
                let showDropdown = true;
                if (elements[key].dropdown.classList.contains('show')) {
                    showDropdown = false;
                }
                hideAllDropdowns();
                if (showDropdown) {
                    elements[key].dropdown.classList.add('show');
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

    handleCheckbox(e) {

        e.preventDefault();
        if (this.checked) {
            document.querySelector('.gender-select_female').classList.remove('gender-select_passive');
            document.querySelector('.gender-select_male').classList.add('gender-select_passive');
        } else {
            document.querySelector('.gender-select_male').classList.remove('gender-select_passive');
            document.querySelector('.gender-select_female').classList.add('gender-select_passive');
        }
    }

    /**
     * Функция регистрации
     */
    handleSignup = async (e) => {
        e.preventDefault();

        const firstNameInput = document.querySelector('.vk-signup-box__first-name-input-wrapper__input');
        const lastNameInput = document.querySelector('.vk-signup-box__last-name-input-wrapper__input');
        const birthdayDay = document.querySelector('.birthday__input__day__value-img p').textContent;
        const birthdayMonth = document.querySelector('.birthday__input__month__value-img p').textContent;
        const birthdayYear = document.querySelector('.birthday__input__year__value-img p').textContent;
        const genderInput = document.querySelector('.cl-switch input')
        const emailInput = document.querySelector('.vk-signup-box__email-input-wrapper__email-input');

        const monthIndex = ['Январь', 'Февраль', "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"].indexOf(birthdayMonth);

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const birthday = new Date(birthdayYear, monthIndex, birthdayDay, 12);
        const birthdayString = birthday.toISOString();

        const gender = genderInput.checked ? 'Female' : 'Male';
        const email = emailInput.value.trim();

        const emailDomainInput = this.#parent
            .querySelector('.vk-signup-box__email-input-wrapper__email-domain-input');
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
            .querySelector('#vk-signup-error');
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
            } else {
                const firstNameRegex = /[\p{Letter}\p{Mark}]+/gu;
                if (!firstNameRegex.test(firstName)) {
                    firstNameError.textContent = "Некорректное имя";
                    firstNameError.classList.add('show');
                    firstNameInput.classList.add('input-background-error');
                    isValidForm = false;
                }

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
            } else {
                const lastNameRegex = /[\p{Letter}\p{Mark}]+/gu;
                if (!lastNameRegex.test(lastName)) {
                    lastNameError.textContent = "Некорректная фамилия";
                    lastNameError.classList.add('show');
                    lastNameInput.classList.add('input-background-error');
                    isValidForm = false;
                }
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

        const dateError = this.#parent
            .querySelector('#vk-signup-error');
        if (birthday > new Date()) {
            dateError.textContent = 'Дата рождения превосходит сегодняшнее число';
            dateError.classList.add('show');
            isValidForm = false;
        } else if (([1, 3, 5, 8, 10].includes(monthIndex) && Number(birthdayDay) === 31) || (monthIndex === 1 && Number(birthdayDay) === 30)) {
            dateError.textContent = 'В этом месяце нет такого числа';
            dateError.classList.add('show');
            isValidForm = false;
        } else if (monthIndex === 1 && Number(birthdayDay) === 29 && birthday.getMonth() !== 1) {
            dateError.textContent = 'В этом месяце в невисокосном году нет такого числа';
            dateError.classList.add('show');
            isValidForm = false;
        }

        if (!isValidForm) {
            return;
        }

        const newUser = {
            // birthday: "string",
            firstname: firstName,
            gender: gender,
            login: email + "@mailhub.su",
            surname: lastName,
            vkId: this.#config.vkUser.vkId,
        };

        dispathcher.do(actionVkAuthSignup(newUser, this.#config.authtoken));
    };

    /**
     * Функция рендера страницы авторизации
     */
    renderLogin = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/login', true));
    };

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
            .querySelector('.vk-signup-box__signup-button-wrapper__vk-button')
            .addEventListener('click', this.handleSignup);

        this.#parent
            .querySelector('.vk-signup-box__authorization-method-switch__method_passive')
            .addEventListener('click', this.renderLogin);

        this.#parent
            .querySelector('.cl-switch input')
            .addEventListener('change', this.handleCheckbox);

        document.addEventListener('click', this.handleDropdowns);


        document
            .addEventListener('keydown', this.handleEnterKey);
        mediator.on('vkSignup', this.handleVkSignupResponse);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {

        this.#parent
            .querySelector('.vk-signup-box__signup-button-wrapper__vk-button')
            .removeEventListener('click', this.handleSignup);

        this.#parent
            .querySelector('.vk-signup-box__authorization-method-switch__method_passive')
            .removeEventListener('click', this.renderLogin);


        document
            .removeEventListener('keydown', this.handleEnterKey);
        mediator.off('vkSignup', this.handleVkSignupResponse);
    }

    handleVkSignupResponse = (status) => {
        const error = this.#parent
            .querySelector('#vk-signup-error');
        switch (status) {
            case 200:
                dispathcher.do(actionRedirect('/main', true));
                break;
            case 400:
                error.textContent = 'Это имя ящика уже занято';
                error.classList.add('show');
                break;
            default:
                error.textContent = 'Проблема на нашей стороне. Уже исправляем';
                error.classList.add('show');
        }
    }
}
