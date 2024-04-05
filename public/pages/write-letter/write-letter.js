import ajax from '../../modules/ajax.js';
import LoginView from '../../views/login.js';
import Menu from '../../components/menu/menu.js';
import Header from '../../components/header/header.js';


const MAX_INPUT_LENGTH = 64;


/**
 * Класс обертки страницы
 * @class
 */
export default class Write__Letter {
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
        const template = Handlebars.templates['write-letter.hbs'];
        const config = this.#config;

        const elements = {
            header: new Header(null, config.header).render(),
            menu: new Menu(null, config.menu).render(),
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
        const birthdayDay = document.querySelector('.profile__content__form__birthday__input__day__value-img p').textContent;
        const birthdayMonth = document.querySelector('.profile__content__form__birthday__input__month__value-img p').textContent;
        const birthdayYear = document.querySelector('.profile__content__form__birthday__input__year__value-img p').textContent;
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
        const birthday = new Date(birthdayYear, monthIndex, birthdayDay);
        const gender = genderInput.checked ? 'female' : 'male';
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
            name: firstName,
            password: password,
            surname: lastName,
            gender: gender,
            birthday: birthday
        };

        const response = await ajax(
            'POST', 'http://89.208.223.140:8080/api/v1/profile__content__form', JSON.stringify(editedUser), 'application/json'
        );

        if (response.ok) {
            // registration successful
            const login = new LoginView();
            login.renderPage();
        } else {
            const errorSign = this.#parent
                .querySelector('.profile__content__form__save__button__error');
            errorSign.classList.add('show');
            errorSign.textContent = 'Проблемы на нашей стороне. Уже исправляем';
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

    handleCheckbox(e) {
        e.preventDefault();
        if (this.checked) {
            document.querySelector('.profile__content__form__gender__select__female').classList.remove('profile__content__form__gender__select__passive');
            document.querySelector('.profile__content__form__gender__select__male').classList.add('profile__content__form__gender__select__passive');
        } else {
            document.querySelector('.profile__content__form__gender__select__male').classList.remove('profile__content__form__gender__select__passive');
            document.querySelector('.profile__content__form__gender__select__female').classList.add('profile__content__form__gender__select__passive');
        }
    }

    handleDropdowns(e) {
        const target = event.target;

        if (document.querySelector('.profile__content__form__birthday__input__day__value-img') === null) { return; }

        const elements = {
            day: {
                button: document.querySelector('.profile__content__form__birthday__input__day__value-img'),
                dropdown: document.querySelector('.dropdown__wrapper__day'),
            },
            month: {
                button: document.querySelector('.profile__content__form__birthday__input__month__value-img'),
                dropdown: document.querySelector('.dropdown__wrapper__month'),

            },
            year: {
                button: document.querySelector('.profile__content__form__birthday__input__year__value-img'),
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
            document.querySelector('.profile__content__form__birthday__input__day__value-img p').textContent = target.textContent;

        } else {
            if (elements.month.dropdown.contains(target) && target.tagName === 'P') {
                document.querySelector('.profile__content__form__birthday__input__month__value-img p').textContent = target.textContent;

            } else {
                if (elements.year.dropdown.contains(target) && target.tagName === 'P') {
                    document.querySelector('.profile__content__form__birthday__input__year__value-img p').textContent = target.textContent;


                } else {
                    if (document.querySelector('.dropdown__profile-menu__profile__button').contains(target)) {
                        console.log('profile');
                    } else {
                        if (document.querySelector('.dropdown__profile-menu__logout__button').contains(target)) {
                            (async () => {
                                await (async () => {
                                    const response = await ajax(
                                        'POST', 'http://89.208.223.140:8080/api/v1/logout', null, 'application/json'
                                    );
                                    const status = await response.status;
                                    if (status < 300) {
                                        const login = new LoginView();
                                        login.renderPage();
                                    } else {
                                        const main = new MainView();
                                        await main.renderPage();
                                    }
                                })();
                            })();

                        }
                    }
                }
            }
            if (!hasTarget) {
                hideAllDropdowns();
            }
        }
    };

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#parent
            .querySelector('.profile__content__form__save__button')
            .addEventListener('click', this.handleSaveForm);

        // this.#parent
        //     .querySelector('.profile__content__form__switch-authorization-method__passive')
        //     .addEventListener('click', this.renderLogin);
        this.#parent
            .querySelector('.cl-switch input')
            .addEventListener('change', this.handleCheckbox);

        this.#parent
        document.addEventListener('click', this.handleDropdowns);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent
            .querySelector('.profile__content__form__save__button')
            .addEventListener('click', this.handleSaveForm);

        // this.#parent
        //     .querySelector('.profile__content__form__switch-authorization-method__passive')
        //     .addEventListener('click', this.renderLogin);
        this.#parent
            .querySelector('.cl-switch input')
            .addEventListener('change', this.handleCheckbox);

        this.#parent
        document.addEventListener('click', this.handleDropdowns);
    }
}
