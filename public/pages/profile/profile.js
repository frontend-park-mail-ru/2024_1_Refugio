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
            phonenumber: this.#config.user.phonenumber,
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

        const firstNameInput = document.querySelector('.profile__content__form__first-name__input');
        const middleNameInput = document.querySelector('.profile__content__form__middle-name__input');
        const lastNameInput = document.querySelector('.profile__content__form__last-name__input');
        const birthdayDay = document.querySelector('.birthday__input__day__value-img p').textContent;
        const birthdayMonth = document.querySelector('.birthday__input__month__value-img p').textContent;
        const birthdayYear = document.querySelector('.birthday__input__year__value-img p').textContent;
        const genderInput = document.querySelector('.cl-switch input')
        // const avatarInput;
        const bioInput = document.querySelector('.profile__content__form__bio__input');
        const phoneNumberInput = document.querySelector('.profile__content__form__phone-number__input');
        const passwordInput = document.querySelector('.profile__content__form__password__input');
        const passwordConfirmInput = document.querySelector('.profile__content__form__password-confirm__input');

        const monthIndex = ['Январь', 'Февраль', "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"].indexOf(birthdayMonth);

        const firstName = firstNameInput.value.trim();
        const middleName = middleNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const birthday = new Date(birthdayYear, monthIndex, birthdayDay).toISOString();
        const gender = genderInput.checked ? 'Female' : 'Male';
        //avatar
        const bio = bioInput.value.trim();
        let phoneNumber = phoneNumberInput.value.trim();
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;

        let oldError = this.#parent
            .querySelector('.profile__content__form__first-name__error');
        oldError.classList.remove('show');
        oldError = firstNameInput;
        oldError.classList.remove('auth__input-backgroud-error');

        oldError = this.#parent
            .querySelector('.profile__content__form__middle-name__error');
        oldError.classList.remove('show');
        oldError = middleNameInput;
        oldError.classList.remove('auth__input-backgroud-error');

        oldError = this.#parent
            .querySelector('.profile__content__form__last-name__error');
        oldError.classList.remove('show');
        oldError = lastNameInput;
        oldError.classList.remove('auth__input-backgroud-error');

        oldError = this.#parent
            .querySelector('.profile__content__form__bio__error');
        oldError.classList.remove('show');
        oldError = bioInput;
        oldError.classList.remove('auth__input-backgroud-error');
        oldError = this.#parent
            .querySelector('.profile__content__form__phone-number__error');
        oldError.classList.remove('show');
        oldError = phoneNumberInput;
        oldError.classList.remove('auth__input-backgroud-error');

        oldError = this.#parent
            .querySelector('.profile__content__form__password__error');
        oldError.classList.remove('show');
        oldError = passwordInput;
        oldError.classList.remove('auth__input-backgroud-error');

        oldError = this.#parent
            .querySelector('.profile__content__form__password-confirm__error');
        oldError.classList.remove('show');
        oldError = passwordConfirmInput;
        oldError.classList.remove('auth__input-backgroud-error');

        oldError = this.#parent
            .querySelector('.profile__content__form__save__button__error');
        oldError.classList.remove('show');


        if (!firstName) {
            const error = this.#parent
                .querySelector('.profile__content__form__first-name__error');
            error.textContent = 'Введите имя';
            error.classList.add('show');
            firstNameInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (!lastName) {
            const error = this.#parent
                .querySelector('.profile__content__form__last-name__error');
            error.textContent = 'Введите фамилию';
            error.classList.add('show');
            lastNameInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (!password && passwordConfirm) {
            const error = this.#parent
                .querySelector('.profile__content__form__password__error');
            error.textContent = 'Введите пароль';
            error.classList.add('show');
            passwordInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (!passwordConfirm && password) {
            const error = this.#parent
                .querySelector('.profile__content__form__password-confirm__error');
            error.textContent = 'Введите пароль ещё раз';
            error.classList.add('show');
            passwordConfirmInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (firstName.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.profile__content__form__first-name__error');
            error.textContent = 'Слишком длинное имя';
            error.classList.add('show');
            firstNameInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (middleName.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.profile__content__form__middle-name__error');
            error.textContent = 'Слишком длинное отчество';
            error.classList.add('show');
            middleNameInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (lastName.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.profile__content__form__last-name__error');
            error.textContent = 'Слишком длинная фамилия';
            error.classList.add('show');
            lastNameInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (bio.length > MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.profile__content__form__bio__error');
            error.textContent = 'Слишком много текста';
            error.classList.add('show');
            bioInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (phoneNumber.length > 32) {
            const error = this.#parent
                .querySelector('.profile__content__form__phone-number__error');
            error.textContent = 'Слишком длинный номер';
            error.classList.add('show');
            phoneNumberInput.classList.add('auth__input-backgroud-error');
            return;
        }


        if (password.length > 4 * MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.profile__content__form__password__error');
            error.textContent = 'Слишком длинный пароль';
            error.classList.add('show');
            passwordInput.classList.add('auth__input-backgroud-error');
            return;
        }

        if (passwordConfirm.length > 4 * MAX_INPUT_LENGTH) {
            const error = this.#parent
                .querySelector('.profile__content__form__password-confirm__error');
            error.textContent = 'Слишком длинный пароль';
            error.classList.add('show');
            passwordConfirmInput.classList.add('auth__input-backgroud-error');
            return;
        }

        const phoneNumberRegex = /^[0-9+\-().\s]+$/;
        if (!phoneNumberRegex.test(phoneNumber)) {
            const error = this.#parent
                .querySelector('.profile__content__form__phone-number__error');
            error.textContent = 'Некорректный номер';
            error.classList.add('show');
            phoneNumberInput.classList.add('auth__input-backgroud-error');
            return;
        }



        if (password && password.length < 8) {
            const error = this.#parent
                .querySelector('.profile__content__form__password__error');
            error.textContent = 'Минимальная длина 8 символов';
            error.classList.add('show');
            passwordInput.classList.add('auth__input-backgroud-error');
            return
        }

        const passwordRegex = /^[a-zA-Z0-9`~`!@#$%^&*()-=_+,.;'\[\]<>?:"{}|\\\/]+$/;
        if (password && !passwordRegex.test(password)) {
            const error = this.#parent
                .querySelector('.profile__content__form__password__error');
            error.textContent = 'Недопустимые символы';
            error.classList.add('show');
            passwordInput.classList.add('auth__input-backgroud-error');
            return
        }


        if (password && password !== passwordConfirm) {
            const error = this.#parent
                .querySelector('.profile__content__form__password-confirm__error');
            error.textContent = 'Пароли не совпадают';
            error.classList.add('show');
            passwordConfirmInput.classList.add('auth__input-backgroud-error');
            return
        }


        phoneNumber = phoneNumber.indexOf('+') === 0 ? '+'.concat(phoneNumber.replace(/\D+/g, '')) : phoneNumber.replace(/\D+/g, '');



        console.log(phoneNumber);
        // create JSON object with user data
        const editedUser = {
            firstname: firstName,
            surname: lastName,
            middlename: middleName,
            gender: gender,
            birthday: birthday,
            phonenumber: phoneNumber,
            description: bio,
            id: this.#config.user.id,
        };

        dispathcher.do(actionUpdateUser(editedUser))
    };

    handleCheckbox(e) {
        e.preventDefault();
        if (this.checked) {
            document.querySelector('.gender__select__female').classList.remove('gender__select__passive');
            document.querySelector('.gender__select__male').classList.add('gender__select__passive');
        } else {
            document.querySelector('.gender__select__male').classList.remove('gender__select__passive');
            document.querySelector('.gender__select__female').classList.add('gender__select__passive');
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
                button: document.querySelector('.header__avatar-img'),
                dropdown: document.querySelector('.dropdown__wrapper__profile-menu'),
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
    };

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
        const formData = new FormData();
        formData.append('avatar', this.#parent.querySelector('#avatar').files[0]);
        dispathcher.do(actionAvatarUpload(formData))
    }
    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#parent
            .querySelector('.profile__content__form__save__button')
            .addEventListener('click', this.handleSaveForm);
        this.#parent
            .querySelector('.dropdown__profile-menu__logout__button')
            .addEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.menu__write-letter__button')
            .addEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('.menu__incoming__button')
            .addEventListener('click', this.handleMain);
        this.#parent
            .querySelector('.cl-switch input')
            .addEventListener('change', this.handleCheckbox);
        this.#parent
            .querySelector('#avatarButton')
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
            .querySelector('.profile__content__form__save__button')
            .removeEventListener('click', this.handleSaveForm);
        this.#parent
            .querySelector('.menu__write-letter__button')
            .removeEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('.menu__incoming__button')
            .removeEventListener('click', this.handleMain);
        this.#parent
            .querySelector('.cl-switch input')
            .removeEventListener('change', this.handleCheckbox);
        this.#parent
            .querySelector('.dropdown__profile-menu__logout__button')
            .removeEventListener('click', this.handleExit);
        this.#parent
            .querySelector('#avatarButton')
            .removeEventListener('click', (e) => this.handleAvatarUpload(e, file));
        this.#parent.removeEventListener('click', this.handleDropdowns);
        mediator.off('logout', this.handleExitResponse)
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
        switch (status) {
            case 200:
                dispathcher.do(actionRedirect('/main', true));
                break;
            default:
                const error = this.#parent
                    .querySelector('.profile__content__form__save__button__error');
                error.textContent = 'Проблемы на нашей стороне. Уже исправляем!';
                error.classList.add('show');
                break;
        }
    }
}
