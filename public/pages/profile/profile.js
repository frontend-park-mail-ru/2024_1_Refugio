import ajax from '../../modules/ajax.js';


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
        const elements = {
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    /**
     * Функция авторизации
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

        const response = await ajax(
            'POST', 'http://89.208.223.140:8080/api/v1/signup', JSON.stringify(newUser), 'application/json'
        );

        if (response.ok) {
            // registration successful
            const login = new LoginView();
            login.renderPage();
        } else {
            const errorSign = this.#parent
                .querySelector('.signup__button__error');
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

        if (button__day === null) { return; }
        
        const button__day = document.querySelector('.profile__content__form__birthday__input__day__value-img');
        const button__month = document.querySelector('.profile__content__form__birthday__input__month__value-img');
        const button__year = document.querySelector('.profile__content__form__birthday__input__year__value-img');
        const button__avatar = document.querySelector('.profile__header__avatar-img');

        const dropdown__day = document.querySelector('.dropdown__wrapper__day');
        const dropdown__month = document.querySelector('.dropdown__wrapper__month');
        const dropdown__year = document.querySelector('.dropdown__wrapper__year');
        const dropdown__profile = document.querySelector('.dropdown__wrapper__profile-menu');



        if (button__day.contains(target)) {
            if (dropdown__day.classList.contains('hide__dropdown__wrapper')) {
                dropdown__day.classList.remove('hide__dropdown__wrapper');
                dropdown__day.classList.add('show__dropdown__wrapper');
            } else {
                dropdown__day.classList.remove('show__dropdown__wrapper');
                dropdown__day.classList.add('hide__dropdown__wrapper');
            }
            dropdown__month.classList.remove('show__dropdown__wrapper');
            dropdown__month.classList.add('hide__dropdown__wrapper');
            dropdown__year.classList.remove('show__dropdown__wrapper');
            dropdown__year.classList.add('hide__dropdown__wrapper');
            dropdown__profile.classList.remove('show__dropdown__wrapper');
            dropdown__profile.classList.add('hide__dropdown__wrapper');

        } else {
            if (button__month.contains(target)) {
                if (dropdown__month.classList.contains('hide__dropdown__wrapper')) {
                    dropdown__month.classList.remove('hide__dropdown__wrapper');
                    dropdown__month.classList.add('show__dropdown__wrapper');
                } else {
                    dropdown__month.classList.remove('show__dropdown__wrapper');
                    dropdown__month.classList.add('hide__dropdown__wrapper');
                }
                dropdown__day.classList.remove('show__dropdown__wrapper');
                dropdown__day.classList.add('hide__dropdown__wrapper');
                dropdown__year.classList.remove('show__dropdown__wrapper');
                dropdown__year.classList.add('hide__dropdown__wrapper');
                dropdown__profile.classList.remove('show__dropdown__wrapper');
                dropdown__profile.classList.add('hide__dropdown__wrapper');
            } else {
                if (button__year.contains(target)) {
                    if (dropdown__year.classList.contains('hide__dropdown__wrapper')) {
                        dropdown__year.classList.remove('hide__dropdown__wrapper');
                        dropdown__year.classList.add('show__dropdown__wrapper');
                    } else {
                        dropdown__year.classList.remove('show__dropdown__wrapper');
                        dropdown__year.classList.add('hide__dropdown__wrapper');
                    }
                    dropdown__day.classList.remove('show__dropdown__wrapper');
                    dropdown__day.classList.add('hide__dropdown__wrapper');
                    dropdown__month.classList.remove('show__dropdown__wrapper');
                    dropdown__month.classList.add('hide__dropdown__wrapper');
                    dropdown__profile.classList.remove('show__dropdown__wrapper');
                    dropdown__profile.classList.add('hide__dropdown__wrapper');
                } else {


                    if (button__avatar.contains(target)) {
                        if (dropdown__profile.classList.contains('hide__dropdown__wrapper')) {
                            dropdown__profile.classList.remove('hide__dropdown__wrapper');
                            dropdown__profile.classList.add('show__dropdown__wrapper');
                        } else {
                            dropdown__profile.classList.remove('show__dropdown__wrapper');
                            dropdown__profile.classList.add('hide__dropdown__wrapper');
                        }
                        dropdown__day.classList.remove('show__dropdown__wrapper');
                        dropdown__day.classList.add('hide__dropdown__wrapper');
                        dropdown__month.classList.remove('show__dropdown__wrapper');
                        dropdown__month.classList.add('hide__dropdown__wrapper');
                        dropdown__year.classList.remove('show__dropdown__wrapper');
                        dropdown__year.classList.add('hide__dropdown__wrapper');
                    }
                    else {


                        if (dropdown__day.contains(target) && target.tagName === 'P') {
                            document.querySelector('.profile__content__form__birthday__input__day__value-img p').textContent = target.textContent;
                        } else {
                            if (dropdown__month.contains(target) && target.tagName === 'P') {
                                document.querySelector('.profile__content__form__birthday__input__month__value-img p').textContent = target.textContent;

                            } else {
                                if (dropdown__year.contains(target) && target.tagName === 'P') {
                                    document.querySelector('.profile__content__form__birthday__input__year__value-img p').textContent = target.textContent;

                                }
                            }
                        }


                        if (dropdown__day.classList.contains('show__dropdown__wrapper')) {
                            dropdown__day.classList.remove('show__dropdown__wrapper');
                            dropdown__day.classList.add('hide__dropdown__wrapper');
                        }
                        if (dropdown__month.classList.contains('show__dropdown__wrapper')) {
                            dropdown__month.classList.remove('show__dropdown__wrapper');
                            dropdown__month.classList.add('hide__dropdown__wrapper');
                        }
                        if (dropdown__year.classList.contains('show__dropdown__wrapper')) {
                            dropdown__year.classList.remove('show__dropdown__wrapper');
                            dropdown__year.classList.add('hide__dropdown__wrapper');
                        }
                        if (dropdown__profile.classList.contains('show__dropdown__wrapper')) {
                            dropdown__profile.classList.remove('show__dropdown__wrapper');
                            dropdown__profile.classList.add('hide__dropdown__wrapper');
                        }



                    }
                }
            }
        }
    };

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        // this.#parent
        //     .querySelector('.signup__button')
        //     .addEventListener('click', this.handleSignup);

        // this.#parent
        //     .querySelector('.signup__switch-authorization-method__passive')
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
        // this.#parent
        //     .querySelector('.signup__button')
        //     .addEventListener('click', this.handleSignup);

        // this.#parent
        //     .querySelector('.signup__switch-authorization-method__passive')
        //     .addEventListener('click', this.renderLogin);
        this.#parent
            .querySelector('.cl-switch input')
            .addEventListener('change', this.handleCheckbox);

        this.#parent
        document.addEventListener('click', this.handleDropdowns);
    }
}
