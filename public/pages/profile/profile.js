import Menu from '../../components/menu/menu.js';
import Header from '../../components/header/header.js';
import Birthday_Select from '../../components/birthday-select/birthday-select.js';
import Gender_Select from '../../components/gender-select/gender-select.js';
import dispathcher from '../../modules/dispathcher.js';
import { actionRedirect, actionUpdateUser, actionLogout, actionAvatarUpload, actionDeleteAccount } from '../../actions/userActions.js';
import mediator from '../../modules/mediator.js';
import template from './profile.hbs'
import router from '../../modules/router.js';


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
        const config = this.#config;
        this.#config.menu.component = new Menu(this.#parent, this.#config.menu);
        const elements = {
            userLetter: this.#config.header.username.charAt(0),
            firstname: this.#config.user.firstname,
            lastname: this.#config.user.surname,
            middlename: this.#config.user.middlename,
            avatar: this.#config.user.avatar,
            description: this.#config.user.description,
            phoneNumber: this.#config.user.phonenumber,
            header: new Header(null, config.header).render(),
            menu: this.#config.menu.component.render(),
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

        const firstNameInput = document.querySelector('.profile__first-name-input-wrapper__input');
        const middleNameInput = document.querySelector('.profile__middle-name-input-wrapper__input');
        const lastNameInput = document.querySelector('.profile__last-name-input-wrapper__input');
        const birthdayDay = document.querySelector('.birthday__input__day__value-img p').textContent;
        const birthdayMonth = document.querySelector('.birthday__input__month__value-img p').textContent;
        const birthdayYear = document.querySelector('.birthday__input__year__value-img p').textContent;
        const genderInput = document.querySelector('.cl-switch input')
        const bioInput = document.querySelector('.profile__bio-input-wrapper__input');
        const phoneNumberInput = document.querySelector('.profile__phone-input-wrapper__input');
        // const passwordInput = document.querySelector('.profile__password-input-wrapper__input');
        // const passwordConfirmInput = document.querySelector('.profile__password-confirm-input-wrapper__input');

        const monthIndex = ['Январь', 'Февраль', "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"].indexOf(birthdayMonth);

        const firstName = firstNameInput.value.trim();
        const middleName = middleNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const birthday = new Date(birthdayYear, monthIndex, birthdayDay, 12);
        const birthdayString = birthday.toISOString();
        const gender = genderInput.checked ? 'Female' : 'Male';
        const bio = bioInput.value.trim();
        let phoneNumber = phoneNumberInput.value.trim();
        // const password = passwordInput.value;
        // const passwordConfirm = passwordConfirmInput.value;

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
            .querySelector('#load-avatar-error');
        oldError.classList.remove('show');

        // oldError = this.#parent
        //     .querySelector('#password-error');
        // oldError.classList.remove('show');
        // oldError = passwordInput;
        // oldError.classList.remove('input-background-error');

        // oldError = this.#parent
        //     .querySelector('#password-confirm-error');
        // oldError.classList.remove('show');
        // oldError = passwordConfirmInput;
        // oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('#buttons-error');
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

        const middleNameError = this.#parent
            .querySelector('#middle-name-error');
        if (middleName) {
            if (middleName.length > MAX_INPUT_LENGTH) {
                middleNameError.textContent = "Слишком длинное отчество";
                middleNameError.classList.add('show');
                middleNameInput.classList.add('input-background-error');
                isValidForm = false;
            } else {
                const middleNameRegex = /[\p{Letter}\p{Mark}]+/gu;
                if (!middleNameRegex.test(middleName)) {
                    middleNameError.textContent = "Некорректное отчество";
                    middleNameError.classList.add('show');
                    middleNameInput.classList.add('input-background-error');
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

        // const passwordError = this.#parent
        //     .querySelector('#password-error');
        // if (password.length > 4 * MAX_INPUT_LENGTH) {
        //     passwordError.textContent = "Слишком длинный пароль";
        //     passwordError.classList.add('show');
        //     passwordInput.classList.add('input-background-error');
        //     isValidForm = false;
        // } else {
        //     if (password && password.length < 8) {
        //         passwordError.textContent = "Минимальная длина 8 символов";
        //         passwordError.classList.add('show');
        //         passwordInput.classList.add('input-background-error');
        //         isValidForm = false;
        //     } else {
        //         const passwordRegex = /^[a-zA-Z0-9`~`!@#$%^&*()-=_+,.;'\[\]<>?:"{}|\\\/]+$/;
        //         if (password && !passwordRegex.test(password)) {
        //             passwordError.textContent = "Недопустимые символы";
        //             passwordError.classList.add('show');
        //             passwordInput.classList.add('input-background-error');
        //             isValidForm = false;
        //         }
        //     }
        // }

        // const passwordConfirmError = this.#parent
        //     .querySelector('#password-confirm-error');

        // if (password && !passwordConfirm) {
        //     passwordConfirmError.textContent = 'Введите пароль ещё раз';
        //     passwordConfirmError.classList.add('show');
        //     passwordConfirmInput.classList.add('input-background-error');
        //     isValidForm = false;
        // } else {
        //     if (password && password !== passwordConfirm) {
        //         passwordConfirmError.textContent = 'Пароли не совпадают';
        //         passwordConfirmError.classList.add('show');
        //         passwordConfirmInput.classList.add('input-background-error');
        //         isValidForm = false;
        //     }

        // }

        const dateError = this.#parent
            .querySelector('#buttons-error');
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
            },
            deleteConfirmation: {
                button: document.querySelector('.profile__buttons__delete-account-button'),
                dropdown: document.querySelector('.profile__buttons__delete-account-button__dropdown__wrapper'),
            }
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

    handleExit = async (e) => {
        e.preventDefault();
        await dispathcher.do(actionLogout());
    };

    handleStat = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/stat', true));
    };

    reader = new FileReader();


    handleAvatarUpload = async (e) => {
        e.preventDefault();
        const input = this.#parent.querySelector('.profile__avatar-load-wrapper__avatar-load-input');
        const handleAvatarProcessing = async () => {
            const file = input.files[0];
            const error = this.#parent
                .querySelector('#load-avatar-error');
            if (file.size > 5 * 1024 * 1024) {
                error.textContent = 'Файл превышает максимальный размер 5 МБ';
                error.classList.add('show');
                return;
            }

            if (!file.type.match('image.*')) {
                error.textContent = 'Некорректный формат файла';
                error.classList.add('show');
                return;
            }

            this.reader.readAsDataURL(file);
            input.removeEventListener('change', handleAvatarProcessing);
            const formData = new FormData();
            formData.append('file', this.#parent.querySelector('.profile__avatar-load-wrapper__avatar-load-input').files[0]);
            dispathcher.do(actionAvatarUpload(formData))
        };
        input.addEventListener('change', handleAvatarProcessing);
        input.click();
    }

    handleAvatarUpdate = () => {
        if (this.reader.result !== null) {
            const img1 = this.#parent.querySelector('.profile__avatar-load-wrapper__avatar');
            const img2 = this.#parent.querySelector('.header__avatar');
            console.log(img1.tagName);
            if (img1.tagName === 'IMG') {
                img1.src = this.reader.result;
                img2.src = this.reader.result;
            } else {
                dispathcher.do(actionRedirect('/profile', false));
            }
        }
    }

    handleBack = async (e) => {
        e.preventDefault();
        if (router.canGoBack() > 1) {
            window.history.back();
        }
        document
            .querySelector('.profile__buttons__cancel-button')
            .removeEventListener('click', this.handleBack);
    }

    handleReset = (e) => {
        e.preventDefault();
        const firstNameInput = document.querySelector('.profile__first-name-input-wrapper__input');
        const middleNameInput = document.querySelector('.profile__middle-name-input-wrapper__input');
        const lastNameInput = document.querySelector('.profile__last-name-input-wrapper__input');

        // const birthdayDay = document.querySelector('.birthday__input__day__value-img p').textContent = '1';
        // const birthdayMonth = document.querySelector('.birthday__input__month__value-img p').textContent = 'Январь';
        // const birthdayYear = document.querySelector('.birthday__input__year__value-img p').textContent = '2024';
        // const genderInput = document.querySelector('.cl-switch input')

        const bioInput = document.querySelector('.profile__bio-input-wrapper__input');
        const phoneNumberInput = document.querySelector('.profile__phone-input-wrapper__input');
        // const passwordInput = document.querySelector('.profile__password-input-wrapper__input');
        // const passwordConfirmInput = document.querySelector('.profile__password-confirm-input-wrapper__input');

        firstNameInput.value = '';
        middleNameInput.value = '';
        lastNameInput.value = '';
        bioInput.value = '';
        phoneNumberInput.value = '';
        // passwordInput.value = '';
        // passwordConfirmInput.value = '';

    }

    handleRollUpMenu = (e) => {
        e.preventDefault();
        const menu = document.querySelector('.menu');
        if (menu.classList.contains('appear')) {
            menu.classList.remove('appear');
        } else {
            menu.classList.add('appear');
        }
    }

    handleDeleteConfirm = async (e) => {
        e.preventDefault();
        console.log(this.#config.user.id);
        dispathcher.do(actionDeleteAccount(this.#config.user.id));
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#parent
            .querySelector('.profile__buttons__delete-account-button__dropdown__yes')
            .addEventListener('click', this.handleDeleteConfirm);
        this.#parent
            .querySelector('.header__rollup-button')
            .addEventListener('click', this.handleRollUpMenu);
        this.#config.menu.component.addListeners();
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .addEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.profile__buttons__save-button')
            .addEventListener('click', this.handleSaveForm);
        this.#parent
            .querySelector('.profile__buttons__cancel-button')
            .addEventListener('click', this.handleBack);
        this.#parent
            .querySelector('.profile__buttons__reset-button')
            .addEventListener('click', this.handleReset);
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .addEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.cl-switch input')
            .addEventListener('change', this.handleCheckbox);
        this.#parent
            .querySelector('.profile__avatar-load-wrapper__avatar-set-button')
            .addEventListener('click', this.handleAvatarUpload);
        this.#parent
            .querySelector('.header__dropdown__stat-button')
            .addEventListener('click', this.handleStat);
        this.#parent
            .querySelector('.profile__avatar-load-container')
            .addEventListener('click', this.handleAvatarUpload);

        this.#parent.addEventListener('click', this.handleDropdowns);
        mediator.on('logout', this.handleExitResponse);
        mediator.on('updateUser', this.handleUpdateResponse);
        mediator.on('avatarUpload', this.handleAvatarResponse);
        mediator.on('logout', this.handleExitResponse);
        mediator.on('deleteAccount', this.handleDeleteAccountResponse);


    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#config.menu.component.removeListeners();
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .removeEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.header__dropdown__stat-button')
            .removeEventListener('click', this.handleStat);
        this.#parent
            .querySelector('.profile__buttons__save-button')
            .removeEventListener('click', this.handleSaveForm);
        this.#parent
            .querySelector('.profile__buttons__cancel-button')
            .removeEventListener('click', this.handleBack);
        this.#parent
            .querySelector('.profile__buttons__reset-button')
            .removeEventListener('click', this.handleReset);
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .removeEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.cl-switch input')
            .removeEventListener('change', this.handleCheckbox);
        this.#parent
            .querySelector('.profile__avatar-load-wrapper__avatar-set-button')
            .removeEventListener('click', this.handleAvatarUpload);
        this.#parent
            .querySelector('.profile__avatar-load-container')
            .removeEventListener('click', this.handleAvatarUpload);

        this.#parent.removeEventListener('click', this.handleDropdowns);
        mediator.off('logout', this.handleExitResponse);
        mediator.off('updateUser', this.handleUpdateResponse);
        mediator.off('avatarUpload', this.handleAvatarResponse);
        mediator.off('logout', this.handleExitResponse);
        mediator.off('deleteAccount', this.handleDeleteAccountResponse);

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

    handleDeleteAccountResponse = (status) => {
        const error = this.#parent
            .querySelector('#buttons-error');
        switch (status) {
            case 200:
                dispathcher.do(actionRedirect('/login', true));
                break;
            default:
                error.textContent = 'Проблема на нашей стороне. Уже исправляем';
                error.classList.add('show');
                break;
        }
    }

    handleUpdateResponse = (status) => {
        const error = this.#parent
            .querySelector('#buttons-error');
        const saveButton = this.#parent.querySelector('.profile__buttons__save-button');
        switch (status) {
            case 200:
                saveButton.textContent = "Успешно сохранено";
                setTimeout(() => {
                    saveButton.textContent = "Сохранить";
                }, 3000)
                // dispathcher.do(actionRedirect('/main', true));
                break;
            default:
                error.textContent = 'Проблема на нашей стороне. Уже исправляем';
                error.classList.add('show');
                break;
        }
    }

    handleAvatarResponse = (status) => {
        const error = this.#parent
            .querySelector('#load-avatar-error');
        switch (status) {
            case 200:
                this.handleAvatarUpdate();
                break;
            default:
                error.textContent = 'Проблема на нашей стороне. Уже исправляем';
                error.classList.add('show');
                break;
        }
    }
}
