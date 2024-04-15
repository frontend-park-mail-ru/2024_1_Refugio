import Menu from '../../components/menu/menu.js';
import Header from '../../components/header/header.js';
import Birthday_Select from '../../components/birthday-select/birthday-select.js';
import Gender_Select from '../../components/gender-select/gender-select.js';
import dispathcher from '../../modules/dispathcher.js';
import { actionRedirect, actionUpdateUser, actionLogout, actionAvatarUpload } from '../../actions/userActions.js';
import mediator from '../../modules/mediator.js';


const MAX_INPUT_LENGTH = 64;


/**
 * Класс обертки страницы
 * @class
 */
export default class Profile {
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
        const template = Handlebars.templates['profile.hbs'];
        const config = this.#config;

        const elements = {
            userLetter: this.#config.header.username.charAt(0),
            firstname: this.#config.user.firstname,
            lastname: this.#config.user.surname,
            middlename: this.#config.user.middlename,
            avatar: this.#config.user.avatar,
            description: this.#config.user.description,
            phoneNumber: this.#config.user.phonenumber,
            header: new Header(null, config.header).render(),
            menu: new Menu(null, config.menu).render(),
            birthday_select: new Birthday_Select(null, config).render(),
            gender_select: new Gender_Select(null, config).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    /**
     * Функция авторизации
     */

    handleSaveForm = async (e) => {
        e.preventDefault();

        const firstNameInput = document.querySelector('.profile__form__first-name-input-wrapper__input');
        const middleNameInput = document.querySelector('.profile__form__middle-name-input-wrapper__input');
        const lastNameInput = document.querySelector('.profile__form__last-name-input-wrapper__input');
        const birthdayDay = document.querySelector('.birthday__input__day__value-img p').textContent;
        const birthdayMonth = document.querySelector('.birthday__input__month__value-img p').textContent;
        const birthdayYear = document.querySelector('.birthday__input__year__value-img p').textContent;
        const genderInput = document.querySelector('.cl-switch input')
        const bioInput = document.querySelector('.profile__form__bio-input-wrapper__input');
        const phoneNumberInput = document.querySelector('.profile__form__phone-input-wrapper__input');
        const passwordInput = document.querySelector('.profile__form__password-input-wrapper__input');
        const passwordConfirmInput = document.querySelector('.profile__form__password-confirm-input-wrapper__input');

        const monthIndex = ['Январь', 'Февраль', "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"].indexOf(birthdayMonth);

        const firstName = firstNameInput.value.trim();
        const middleName = middleNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const birthday = new Date(birthdayYear, monthIndex, birthdayDay, 12);
        const birthdayString = birthday.toISOString();
        const gender = genderInput.checked ? 'Female' : 'Male';
        const bio = bioInput.value.trim();
        let phoneNumber = phoneNumberInput.value.trim();
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;

        let oldError = this.#parent
            .querySelector('#first-name-error');
        oldError.classList.remove('show');
        oldError = firstNameInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('#middle-name-error');
        oldError.classList.remove('show');
        oldError = middleNameInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('#last-name-error');
        oldError.classList.remove('show');
        oldError = lastNameInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('#bio-error');
        oldError.classList.remove('show');
        oldError = bioInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('#phone-error');
        oldError.classList.remove('show');
        oldError = phoneNumberInput;
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
            .querySelector('#save-error');
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

        const middleNameError = this.#parent
            .querySelector('#middle-name-error');
        if (middleName.length > MAX_INPUT_LENGTH) {
            middleNameError.textContent = "Слишком длинное отчество";
            middleNameError.classList.add('show');
            middleNameInput.classList.add('input-background-error');
            isValidForm = false;
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

        const bioError = this.#parent
            .querySelector('#bio-error');
        if (bio.length > MAX_INPUT_LENGTH) {
            bioError.textContent = "Слишком много текста";
            bioError.classList.add('show');
            bioInput.classList.add('input-background-error');
            isValidForm = false;
        }

        const phoneError = this.#parent
            .querySelector('#phone-error');
        if (phoneNumber.length > 32) {
            phoneError.textContent = "Слишком длинный номер";
            phoneError.classList.add('show');
            phoneNumberInput.classList.add('input-background-error');
            isValidForm = false;
        } else {
            const phoneNumberRegex = /^[0-9+\-().\s]+$/;
            if (phoneNumber && !phoneNumberRegex.test(phoneNumber)) {
                phoneError.textContent = "Некорректный номер";
                phoneError.classList.add('show');
                phoneNumberInput.classList.add('input-background-error');
                isValidForm = false;
            }
        }

        const passwordError = this.#parent
            .querySelector('#password-error');
        if (password.length > 4 * MAX_INPUT_LENGTH) {
            passwordError.textContent = "Слишком длинный пароль";
            passwordError.classList.add('show');
            passwordInput.classList.add('input-background-error');
            isValidForm = false;
        } else {
            if (password && password.length < 8) {
                passwordError.textContent = "Минимальная длина 8 символов";
                passwordError.classList.add('show');
                passwordInput.classList.add('input-background-error');
                isValidForm = false;
            } else {
                const passwordRegex = /^[a-zA-Z0-9`~`!@#$%^&*()-=_+,.;'\[\]<>?:"{}|\\\/]+$/;
                if (password && !passwordRegex.test(password)) {
                    passwordError.textContent = "Недопустимые символы";
                    passwordError.classList.add('show');
                    passwordInput.classList.add('input-background-error');
                    isValidForm = false;
                }
            }
        }

        const passwordConfirmError = this.#parent
            .querySelector('#password-confirm-error');
        if (passwordConfirm.length > 4 * MAX_INPUT_LENGTH) {
            passwordConfirmError.textContent = "Слишком длинный пароль";
            passwordConfirmError.classList.add('show');
            passwordConfirmInput.classList.add('input-background-error');
            isValidForm = false;
        } else {
            if (password && !passwordConfirm) {
                passwordConfirmError.textContent = 'Введите пароль ещё раз';
                passwordConfirmError.classList.add('show');
                passwordConfirmInput.classList.add('input-background-error');
                isValidForm = false;
            } else {
                if (password && password !== passwordConfirm) {
                    passwordConfirmError.textContent = 'Пароли не совпадают';
                    passwordConfirmError.classList.add('show');
                    passwordConfirmInput.classList.add('input-background-error');
                    isValidForm = false;
                }
            }
        }

        const dateError = this.#parent
            .querySelector('#save-error');
        console.log(birthday)
        console.log(new Date())
        console.log(birthday > new Date())
        if (birthday > new Date()) {
            dateError.textContent = 'Дата рождения превосходит сегодняшнее число';
            dateError.classList.add('show');
            isValidForm = false;
        } else if (([3, 5, 8, 10].includes(monthIndex) && Number(birthdayDay) === 31) || (monthIndex === 1 && Number(birthdayDay) === 30)) {
            dateError.textContent = 'В этом месяце нет такого числа';
            dateError.classList.add('show');
            isValidForm = false;
        } else if (monthIndex === 1 && Number(birthdayDay) === 29 && birthday.getMonth() !== 1) {
            dateError.textContent = 'В этом месяце в невисокосном году нет такого числа';
            dateError.classList.add('show');
            isValidForm = false;
        }

        phoneNumber = phoneNumber.indexOf('+') === 0 ? '+'.concat(phoneNumber.replace(/\D+/g, '')) : phoneNumber.replace(/\D+/g, '');

        if (!isValidForm) {
            return;
        }

        // create JSON object with user data
        const editedUser = {
            firstname: firstName,
            surname: lastName,
            middlename: middleName,
            gender: gender,
            birthday: birthdayString,
            phonenumber: phoneNumber,
            description: bio,
            id: this.#config.user.id,
        };

        dispathcher.do(actionUpdateUser(editedUser))
    };

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
            profile: {
                button: document.querySelector('.header__avatar'),
                dropdown: document.querySelector('.header__dropdown'),
            }
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
        console.log(1);


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

    handleExit = async (e) => {
        e.preventDefault();
        await dispathcher.do(actionLogout());
    };

    handleWriteLetter = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/write_letter', true));
    };

    handleMain = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/main', true));
    };

    handleAvatarUpload = async (e) => {
        e.preventDefault();
        const input = this.#parent.querySelector('.profile__form__avatar-load-wrapper__avatar-load-input');
        const handleAvatarProcessing = async () => {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const img1 = this.#parent.querySelector('.profile__form__avatar-load-wrapper__avatar');
                img1.src = event.target.result;
                const img2 = this.#parent.querySelector('.header__avatar');
                img2.src = event.target.result;
            };
            reader.readAsDataURL(file);
            input.removeEventListener('change', handleAvatarProcessing);
            const formData = new FormData();
            formData.append('file', this.#parent.querySelector('.profile__form__avatar-load-wrapper__avatar-load-input').files[0]);
            dispathcher.do(actionAvatarUpload(formData))
        };
        input.addEventListener('change', handleAvatarProcessing);
        input.click();

    }

    handleSent = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/sent', true));
    };

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#parent
            .querySelector('.profile__form__save-button-wrapper__button')
            .addEventListener('click', this.handleSaveForm);
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .addEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.menu__write-letter-button')
            .addEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('#incoming-folder')
            .addEventListener('click', this.handleMain);
        this.#parent.
            querySelector('.header__logo')
            .addEventListener('click', this.handleMain);
        this.#parent
            .querySelector('#sent-folder')
            .addEventListener('click', this.handleSent);
        this.#parent
            .querySelector('.cl-switch input')
            .addEventListener('change', this.handleCheckbox);
        this.#parent
            .querySelector('.profile__form__avatar-load-wrapper__avatar-set-button')
            .addEventListener('click', this.handleAvatarUpload);
        this.#parent.addEventListener('click', this.handleDropdowns);
        mediator.on('logout', this.handleExitResponse);
        mediator.on('updateUser', this.handleUpdateResponse);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent
            .querySelector('.profile__form__save-button-wrapper__button')
            .removeEventListener('click', this.handleSaveForm);
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .removeEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.menu__write-letter-button')
            .removeEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('#incoming-folder')
            .removeEventListener('click', this.handleMain);
        this.#parent.
            querySelector('.header__logo')
            .removeEventListener('click', this.handleMain);
        this.#parent
            .querySelector('#sent-folder')
            .removeEventListener('click', this.handleSent);
        this.#parent
            .querySelector('.cl-switch input')
            .removeEventListener('change', this.handleCheckbox);
        this.#parent
            .querySelector('.profile__form__avatar-load-wrapper__avatar-set-button')
            .removeEventListener('click', this.handleAvatarUpload);
        this.#parent.removeEventListener('click', this.handleDropdowns);
        mediator.off('logout', this.handleExitResponse);
        mediator.off('updateUser', this.handleUpdateResponse);
    }

    handleExitResponse = (status) => {
        switch (status) {
            case 200:
                dispathcher.do(actionRedirect('/login', true));
                break;
            default:
                break;
        }
    }

    handleUpdateResponse = (status) => {
        const error = this.#parent
            .querySelector('#save-error');
        switch (status) {
            case 200:
                // dispathcher.do(actionRedirect('/main', true));
                break;
            default:
                error.textContent = 'Проблемы на нашей стороне. Уже исправляем!';
                error.classList.add('show');
                break;
        }
    }
}
