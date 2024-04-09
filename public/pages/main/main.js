import Header from '../../components/header/header.js';
import Menu from '../../components/menu/menu.js';
import List_letters from '../../components/list-letters/list-letters.js';
import mediator from '../../modules/mediator.js';
import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionRedirect, actionRedirectToLetter, actionUpdateEmail, actionDeleteEmail } from '../../actions/userActions.js';

/**
 * Класс обертки страницы
 * @class
 */
export default class Main {
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
        const template = Handlebars.templates['main.hbs'];
        this.#config.content.sent = false;
        const elements = {
            header: new Header(null, this.#config.header).render(),
            menu: new Menu(null, this.#config.menu).render(),
            list_letters: new List_letters(null, this.#config.content).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    selectedListLetters = []

    handleDropdowns(e) {
        const target = e.target;

        const elements = {
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
        if (!hasTarget) {
            hideAllDropdowns();
        }
    };

    /**
     * Функция выхода из ящика
     */
    handleExit = async (e) => {
        e.preventDefault();
        await dispathcher.do(actionLogout());
    };

    handleProfile = (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/profile', true));
    };

    handleWriteLetter = (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/write_letter', true));
    };

    handleLetter = async (e, id) => {
        e.preventDefault();
        dispathcher.do(actionRedirectToLetter(id, true));
    };

    handleSent = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/sent', true));
    };

    handleHeader() {
        const unselectedButtons = document.querySelector('.main__content__header__unselected-buttons');
        const selectedButtons = document.querySelector('.main__content__header__selected-buttons');

        if (this.selectedListLetters.length > 0) {
            selectedButtons.classList.remove('remove');
            unselectedButtons.classList.add('remove');
            document.querySelector('#selected-letters-counter').textContent = this.selectedListLetters.length;
        } else {
            selectedButtons.classList.add('remove');
            unselectedButtons.classList.remove('remove');
        }
    }

    handleCheckbox = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        const letter = document.querySelector(`[data-id="${id}"]`);
        const avatar = letter.querySelector('.list-letter__avatar')

        if (letter.classList.contains('selected-list-letter')) {
            letter.classList.remove('selected-list-letter');
            const icon = letter.querySelectorAll('.list-letter__avatar-checkbox-centered')[1];
            icon.parentNode.removeChild(icon);
            avatar.classList.remove('remove');
            this.selectedListLetters.pop(letter);
        } else {
            letter.classList.add('selected-list-letter');
            const icon = document.createElement('img');
            icon.src = '../../static/icons/done.svg';
            icon.alt = '';
            icon.classList.add('list-letter__avatar-checkbox-centered');
            avatar.parentNode.appendChild(icon);
            avatar.classList.add('remove');
            this.selectedListLetters.push(letter);
        }
        this.handleHeader();
    }

    handleStatus = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        const letter = document.querySelector(`[data-id="${id}"]`);
        const statusChild = letter.querySelector('.list-letter__status img');
        const statusImg = letter.querySelector('.list-letter__status-offer');
        const img = document.createElement('img');
        img.alt = '';
        if (statusImg === null) {
            img.src = '../../static/icons/read-on-offer__256.svg';
            img.classList.add('list-letter__status-offer');
        }
        else {
            img.src = '../../static/icons/read-on__256.svg';
        }
        statusChild.parentNode.replaceChild(img, statusChild);

        const letters = this.#config.content.list_letters;
        const value = letters.find(item => String(item.id) === id);
        value.readStatus = !value.readStatus;
        dispathcher.do(actionUpdateEmail(id, value));
    }

    handleSelectAll = (e) => {
        e.preventDefault();

        document.querySelectorAll('.list-letter').forEach(letter => {
            const avatar = letter.querySelector('.list-letter__avatar')
            letter.classList.add('selected-list-letter');
            const icon = document.createElement('img');
            icon.src = '../../static/icons/done.svg';
            icon.alt = '';
            icon.classList.add('list-letter__avatar-checkbox-centered');
            avatar.parentNode.appendChild(icon);
            avatar.classList.add('remove');
            this.selectedListLetters.push(letter);
        });
        this.handleHeader();
    }

    handleDeselect = (e) => {
        e.preventDefault();

        document.querySelectorAll('.list-letter').forEach(letter => {
            if (letter.classList.contains('selected-list-letter')) {
                const avatar = letter.querySelector('.list-letter__avatar')
                letter.classList.remove('selected-list-letter');
                const icon = letter.querySelectorAll('.list-letter__avatar-checkbox-centered')[1];
                icon.parentNode.removeChild(icon);
                avatar.classList.remove('remove');
                this.selectedListLetters.pop(letter);
            }
        });
        this.handleHeader();
    }

    handleMarkAllAsRead = (e) => {
        e.preventDefault();
        const letters = this.#config.content.list_letters;
        if (letters.length === 0 ) {
            return;
        }
        letters.forEach(item => {
            if (item.readStatus === true) {
                const letter = document.querySelector(`[data-id="${item.id}"]`);
                const statusChild = letter.querySelector('.list-letter__status img');
                const img = document.createElement('img');
                img.alt = '';
                img.src = '../../static/icons/read-on-offer__256.svg';
                img.classList.add('list-letter__status-offer');
                statusChild.parentNode.replaceChild(img, statusChild);


                item.readStatus = false
                dispathcher.do(actionUpdateEmail(item.id, item));
            }
        })

    }

    handleDelete = (e) => {
        e.preventDefault();
        this.selectedListLetters.forEach(item => {
            const letter = document.querySelectorAll(`[data-id="${item.dataset.id}"]`);
            letter[0].remove();
            dispathcher.do(actionDeleteEmail(item.dataset.id));
            this.selectedListLetters = this.selectedListLetters.filter(el => el !== item);
        });
        this.handleDeselect(e);
        this.handleHeader();
    }

    handleMarkAsRead = (e) => {
        e.preventDefault();
        const selectedIds = this.selectedListLetters.map(letter => letter.dataset.id);
        const letters = this.#config.content.list_letters;
        letters.forEach(item => {

            if (item.readStatus === true && selectedIds.includes(String(item.id))) {

                const letter = document.querySelector(`[data-id="${item.id}"]`);
                const statusChild = letter.querySelector('.list-letter__status img');
                const img = document.createElement('img');
                img.alt = '';
                img.src = '../../static/icons/read-on-offer__256.svg';
                img.classList.add('list-letter__status-offer');
                statusChild.parentNode.replaceChild(img, statusChild);


                item.readStatus = false
                dispathcher.do(actionUpdateEmail(item.id, item));
            }
        })
        this.handleDeselect(e);
    }

    handleMarkAsUnread = (e) => {
        e.preventDefault();
        const selectedIds = this.selectedListLetters.map(letter => letter.dataset.id);

        const letters = this.#config.content.list_letters;
        letters.forEach(item => {
            if (item.readStatus === false && selectedIds.includes(String(item.id))) {
                const letter = document.querySelector(`[data-id="${item.id}"]`);
                const statusChild = letter.querySelector('.list-letter__status img');
                const statusImg = letter.querySelector('.list-letter__status-offer');
                const img = document.createElement('img');
                img.alt = '';
                img.src = '../../static/icons/read-on__256.svg';
                statusChild.parentNode.replaceChild(img, statusChild);

                item.readStatus = true;
                dispathcher.do(actionUpdateEmail(item.id, item));
            }
        })
        this.handleDeselect(e);
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {

        this.#parent
            .querySelectorAll('.list-letter').forEach((letter) => {
                letter.querySelector('.list-letter__avatar-wrapper').addEventListener('click', (e) => this.handleCheckbox(e, letter.dataset.id));
            });
        this.#parent
            .querySelectorAll('.list-letter').forEach((letter) => {
                letter.querySelector('.list-letter__status').addEventListener('click', (e) => this.handleStatus(e, letter.dataset.id));
            });
        this.#parent
            .querySelector('#select-all')
            .addEventListener('click', this.handleSelectAll);
        this.#parent
            .querySelector('#deselect')
            .addEventListener('click', this.handleDeselect);
        this.#parent
            .querySelector('#mark-all-as-read')
            .addEventListener('click', this.handleMarkAllAsRead);
        this.#parent
            .querySelector('#delete')
            .addEventListener('click', this.handleDelete);
        this.#parent
            .querySelector('#mark-as-read')
            .addEventListener('click', this.handleMarkAsRead);
        this.#parent
            .querySelector('#mark-as-unread')
            .addEventListener('click', this.handleMarkAsUnread);



        this.#parent
            .querySelectorAll('.list-letter').forEach((letter) => {
                letter.addEventListener('click', (e) => this.handleLetter(e, letter.dataset.id));
            });
        this.#parent
            .querySelector('.dropdown__profile-menu__logout__button')
            .addEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.dropdown__profile-menu__profile__button')
            .addEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('.menu__write-letter__button')
            .addEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('.menu__sent__button')
            .addEventListener('click', this.handleSent);
        this.#parent.addEventListener('click', this.handleDropdowns);
        mediator.on('logout', this.handleExitResponse)
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent
            .querySelectorAll('.list-letter').forEach((letter) => {
                letter.querySelector('.list-letter__avatar-wrapper').addEventListener('click', (e) => this.handleCheckbox(e, letter.dataset.id));
            });
        this.#parent
            .querySelectorAll('.list-letter').forEach((letter) => {
                letter.querySelector('.list-letter__status').addEventListener('click', (e) => this.handleStatus(e, letter.dataset.id));
            });
        this.#parent
            .querySelector('#select-all')
            .addEventListener('click', this.handleSelectAll);
        this.#parent
            .querySelector('#deselect')
            .addEventListener('click', this.handleDeselect);
        this.#parent
            .querySelector('#mark-all-as-read')
            .addEventListener('click', this.handleMarkAllAsRead);
        this.#parent
            .querySelector('#delete')
            .addEventListener('click', this.handleDelete);
        this.#parent
            .querySelector('#mark-as-read')
            .addEventListener('click', this.handleMarkAsRead);
        this.#parent
            .querySelector('#mark-as-unread')
            .addEventListener('click', this.handleMarkAsUnread);



        this.#parent
            .querySelectorAll('.list-letter').forEach((letter) => {
                letter.removeEventListener('click', (e) => this.handleLetter(e, letter.dataset.id));
            });
        this.#parent
            .querySelector('.dropdown__profile-menu__logout__button')
            .removeEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.dropdown__profile-menu__profile__button')
            .removeEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('.menu__write-letter__button')
            .removeEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('.menu__sent__button')
            .removeEventListener('click', this.handleSent);
        this.#parent.removeEventListener('click', this.handleDropdowns);
        mediator.off('logout', this.handleExitResponse)
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
}