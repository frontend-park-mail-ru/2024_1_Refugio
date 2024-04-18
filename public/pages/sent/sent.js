import Header from '../../components/header/header.js';
import Menu from '../../components/menu/menu.js';
import List_letters from '../../components/list-letters/list-letters.js';
import mediator from '../../modules/mediator.js';
import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionRedirect, actionRedirectToLetter, actionUpdateEmail, actionDeleteEmail } from '../../actions/userActions.js';
import template from '../main/main.hbs'


/**
 * Класс обертки страницы
 * @class
 */
export default class Sent {
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
                button: document.querySelector('.header__avatar'),
                dropdown: document.querySelector('.header__dropdown'),
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
        if (!hasTarget) {
            hideAllDropdowns();
        }
    }

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
        const letters = this.#config.content.list_letters;
        const value = letters.find(item => String(item.id) === id);
        value.dateOfDispatch = undefined;
        if (value.readStatus === false) {
            value.readStatus = true;
            dispathcher.do(actionUpdateEmail(id, value));
        }
        dispathcher.do(actionRedirectToLetter(id, true));
    };

    handleIncoming = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/main', true));
    };

    handleHeader() {
        const unselectedButtons = {
            select_all: document.querySelector('#select-all'),
            mark_all_as_read: document.querySelector('#mark-all-as-read'),
        };
        const selectedButtons = {
            deselect: document.querySelector('#deselect'),
            delete: document.querySelector('#delete'),
            // move_to: document.querySelector('#move-to'),
            // spam: document.querySelector('#spam'),
            mark_as_read: document.querySelector('#mark-as-read'),
            mark_as_unread: document.querySelector('#mark-as-unread'),
        };

        if (this.selectedListLetters.length > 0) {
            Object.values(selectedButtons).forEach(button => {
                button.classList.add('appear');
            });
            Object.values(unselectedButtons).forEach(button => {
                button.classList.remove('appear');
            });
            document.querySelector('#selected-letters-counter').textContent = this.selectedListLetters.length;
        } else {
            Object.values(selectedButtons).forEach(button => {
                button.classList.remove('appear');
            });
            Object.values(unselectedButtons).forEach(button => {
                button.classList.add('appear');
            });
        }
    }

    handleCheckbox = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        const letter = document.querySelector(`[data-id="${id}"]`);
        const avatar = letter.querySelector('.list-letter__avatar')

        if (letter.classList.contains('selected-list-letter')) {
            letter.classList.remove('selected-list-letter');
            const icon = letter.querySelectorAll('.list-letter__avatar__checkbox_centered')[1];
            icon.parentNode.removeChild(icon);
            avatar.classList.remove('remove');
            this.selectedListLetters = this.selectedListLetters.filter(element => element !== letter);
        } else {
            letter.classList.add('selected-list-letter');
            const icon = document.createElement('img');
            icon.src = '/icons/done.svg';
            icon.alt = '';
            icon.classList.add('list-letter__avatar__checkbox_centered');
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
            img.src = '/icons/read-on-offer__256.svg';
            img.classList.add('list-letter__status-offer');
        }
        else {
            img.src = '/icons/read-on__256.svg';
        }
        statusChild.parentNode.replaceChild(img, statusChild);

        const letters = this.#config.content.list_letters;
        const value = letters.find(item => String(item.id) === id);
        value.readStatus = !value.readStatus;
        value.dateOfDispatch = undefined;
        dispathcher.do(actionUpdateEmail(id, value));
    }

    handleSelectAll = (e) => {
        e.preventDefault();

        document.querySelectorAll('.list-letter').forEach(letter => {
            const avatar = letter.querySelector('.list-letter__avatar')
            letter.classList.add('selected-list-letter');
            const icon = document.createElement('img');
            icon.src = '/icons/done.svg';
            icon.alt = '';
            icon.classList.add('list-letter__avatar__checkbox_centered');
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
                const icon = letter.querySelectorAll('.list-letter__avatar__checkbox_centered')[1];
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
        if (letters.length === 0) {
            return;
        }
        letters.forEach(item => {
            if (item.readStatus === false) {
                const letter = document.querySelector(`[data-id="${item.id}"]`);
                const statusChild = letter.querySelector('.list-letter__status img');
                const img = document.createElement('img');
                img.alt = '';
                img.src = '/icons/read-on-offer__256.svg';
                img.classList.add('list-letter__status-offer');
                statusChild.parentNode.replaceChild(img, statusChild);


                item.readStatus = true;
                item.dateOfDispatch = undefined;

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

            if (item.readStatus === false && selectedIds.includes(String(item.id))) {

                const letter = document.querySelector(`[data-id="${item.id}"]`);
                const statusChild = letter.querySelector('.list-letter__status img');
                const img = document.createElement('img');
                img.alt = '';
                img.src = '/icons/read-on-offer__256.svg';
                img.classList.add('list-letter__status-offer');
                statusChild.parentNode.replaceChild(img, statusChild);


                item.readStatus = true
                item.dateOfDispatch = undefined;

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
            if (item.readStatus === true && selectedIds.includes(String(item.id))) {
                const letter = document.querySelector(`[data-id="${item.id}"]`);
                const statusChild = letter.querySelector('.list-letter__status img');
                const img = document.createElement('img');
                img.alt = '';
                img.src = '/icons/read-on__256.svg';
                statusChild.parentNode.replaceChild(img, statusChild);

                item.readStatus = false;
                item.dateOfDispatch = undefined;

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
            .querySelector('.header__dropdown__logout-button')
            .addEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.header__dropdown__profile-button')
            .addEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('.menu__write-letter-button')
            .addEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('#incoming-folder')
            .addEventListener('click', this.handleIncoming);
        this.#parent.addEventListener('click', this.handleDropdowns);
        mediator.on('logout', this.handleExitResponse)
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent
            .querySelectorAll('.list-letter').forEach((letter) => {
                letter.querySelector('.list-letter__avatar-wrapper').removeEventListener('click', (e) => this.handleCheckbox(e, letter.dataset.id));
            });
        this.#parent
            .querySelectorAll('.list-letter').forEach((letter) => {
                letter.querySelector('.list-letter__status').removeEventListener('click', (e) => this.handleStatus(e, letter.dataset.id));
            });
        this.#parent
            .querySelector('#select-all')
            .removeEventListener('click', this.handleSelectAll);
        this.#parent
            .querySelector('#deselect')
            .removeEventListener('click', this.handleDeselect);
        this.#parent
            .querySelector('#mark-all-as-read')
            .removeEventListener('click', this.handleMarkAllAsRead);
        this.#parent
            .querySelector('#delete')
            .removeEventListener('click', this.handleDelete);
        this.#parent
            .querySelector('#mark-as-read')
            .removeEventListener('click', this.handleMarkAsRead);
        this.#parent
            .querySelector('#mark-as-unread')
            .addEventListener('click', this.handleMarkAsUnread);



        this.#parent
            .querySelectorAll('.list-letter').forEach((letter) => {
                letter.removeEventListener('click', (e) => this.handleLetter(e, letter.dataset.id));
            });
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .removeEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.header__dropdown__profile-button')
            .removeEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('.menu__write-letter-button')
            .removeEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('#incoming-folder')
            .removeEventListener('click', this.handleIncoming);
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