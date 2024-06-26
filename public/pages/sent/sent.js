import Header from '../../components/header/header.js';
import Menu from '../../components/menu/menu.js';
import List_letters from '../../components/list-letters/list-letters.js';
import mediator from '../../modules/mediator.js';
import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionRedirect, actionRedirectToLetter, actionUpdateEmail } from '../../actions/userActions.js';
import template from './sent.hbs'


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
        this.#config.content.sent = true;
        this.#config.menu.component = new Menu(this.#parent, this.#config.menu);
        this.#config.header.component = new Header(this.#parent, this.#config.header);

        const elements = {
            menu: this.#config.menu.component.render(),
            header: this.#config.header.component.render(),
            list_letters: new List_letters(null, this.#config.content).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    selectedListLetters = []

    /**
     * Функция, регулирующая отображение ошибки
     */
    hideError = () => {
        const oldError = this.#parent
            .querySelector('.letter__error');
        oldError.classList.remove('appear');
    };

    /**
     * Функция, регулирующая отображения всех всплывающих окон на странице
     */
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

    /**
     * Функция перехода на страницу профиля
     */
    handleProfile = (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/profile', true));
    };

    /**
     * Функция перехода на страницу письма
     */
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

    /**
     * Функция отображения хедера
     */
    handleHeader() {
        const unselectedButtons = {
            select_all: document.querySelector('#select-all'),
            // mark_all_as_read: document.querySelector('#mark-all-as-read'),
        };
        const selectedButtons = {
            deselect: document.querySelector('#deselect'),
            delete: document.querySelector('#delete'),
            // move_to: document.querySelector('#move-to'),
            // spam: document.querySelector('#spam'),
            // mark_as_read: document.querySelector('#mark-as-read'),
            // mark_as_unread: document.querySelector('#mark-as-unread'),
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

    /**
     * Функция выделения одного письма
     */
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

    /**
     * Функция отметки одного письма прочитанным/непрочитанным
     */
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

    /**
     * Функция выделения всех писем
     */
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

    /**
     * Функция отмены выделения
     */
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

    /**
     * Функция всплывания окна меню для мобильной версии
     */
    

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {

        
        this.#config.menu.component.addListeners();
        this.#config.header.component.addListeners();

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
        // this.#parent
        //     .querySelector('#mark-all-as-read')
        //     .addEventListener('click', this.handleMarkAllAsRead);
        this.#parent
            .querySelector('#delete')
            .addEventListener('click', this.handleDelete);
        // this.#parent
        //     .querySelector('#mark-as-read')
        //     .addEventListener('click', this.handleMarkAsRead);
        // this.#parent
        //     .querySelector('#mark-as-unread')
        //     .addEventListener('click', this.handleMarkAsUnread);



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
            .querySelector('.header__dropdown__stat-button')
            .addEventListener('click', this.handleStat);
        this.#parent.addEventListener('click', this.handleDropdowns);
        mediator.on('logout', this.handleExitResponse)
        mediator.on('deleteEmail', this.handleDeleteEmailResponse);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#config.menu.component.removeListeners();
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
            .querySelector('.header__dropdown__stat-button')
            .removeEventListener('click', this.handleStat);
        this.#parent
            .querySelector('#deselect')
            .removeEventListener('click', this.handleDeselect);
        // this.#parent
        //     .querySelector('#mark-all-as-read')
        //     .addEventListener('click', this.handleMarkAllAsRead);
        this.#parent
            .querySelector('#delete')
            .removeEventListener('click', this.handleDelete);
        // this.#parent
        //     .querySelector('#mark-as-read')
        //     .addEventListener('click', this.handleMarkAsRead);
        // this.#parent
        //     .querySelector('#mark-as-unread')
        //     .addEventListener('click', this.handleMarkAsUnread);



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
        this.#parent.removeEventListener('click', this.handleDropdowns);
        mediator.off('logout', this.handleExitResponse)
        mediator.off('deleteEmail', this.handleDeleteEmailResponse);
    }

    /**
     * Функция обработки ответа на запрос выхода из аккаунта
     */
    handleExitResponse = (status) => {
        switch (status) {
            case 200:
                dispathcher.do(actionRedirect('/login', true));
                break;
            default:
                break;
        }
    }

    /**
     * Функция обработки ответа на запрос обновления письма
     */
    handleUpdateEmailResponse = (status) => {
        const error = this.#parent.querySelector('.letter__error');
        switch (status) {
            case 200:
                break;
            default:
                error.textContent = 'Проблема на нашей стороне, уже исправляем';
                error.classList.add('appear');
                break;
        }
    }

    /**
     * Функция обработки ответа на запрос удаления письма
     */
    handleDeleteEmailResponse = (status) => {
        const error = this.#parent.querySelector('.letter__error');
        switch (status) {
            case 200:
                break;
            default:
                error.textContent = 'Проблема на нашей стороне, уже исправляем';
                error.classList.add('appear');
                break;
        }
    }
}
