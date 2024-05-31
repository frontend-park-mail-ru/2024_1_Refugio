import Header from '../../components/header/header.js';
import Menu from '../../components/menu/menu.js';
import List_letters from '../../components/list-letters/list-letters.js';
import mediator from '../../modules/mediator.js';
import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionAddLetterToFolder, actionRedirect, actionRedirectToLetter, actionUpdateEmail, actionDeleteEmail, actionDeleteLetterFromFolder } from '../../actions/userActions.js';
import template from './main.hbs'

import emailStore from '../../stores/emailStore.js';
import userStore from '../../stores/userStore.js';
import folderStore from '../../stores/folderStore.js';


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
        this.#config.content.sent = false;
        this.#config.menu.component = new Menu(this.#parent, this.#config.menu);
        this.#config.header.component = new Header(this.#parent, this.#config.header);
        const elements = {
            header: this.#config.header.component.render(),
            menu: this.#config.menu.component.render(),
            list_letters: new List_letters(null, this.#config.content).render(),
            spam: this.#config.spam,
            contains_letters: this.#config.content.list_letters?.length !== 0,
            folders: this.#config.menu.folders,
            folder_id: this.#config.folderNumber,
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
        // if (emailStore.incoming_count > emailStore.old_incoming_count) {
        //     emailStore.old_incoming_count = emailStore.incoming_count;
        //     this.notification(emailStore.incoming_count)
        // }


    }

    notification = (text) => {
        // if (!("Notification" in window)) {
        //     alert("This browser does not support desktop notification");
        // } else if (Notification.permission === "granted") {
        //     const notification = new Notification(`Новое письмо. Непрочитанных писем: ${text}`);
        // } else if (Notification.permission !== "denied") {
        //     Notification.requestPermission().then((permission) => {
        //         if (permission === "granted") {
        //             const notification = new Notification(`Новое письмо. Непрочитанных писем: ${text}`);
        //         }
        //     });
        // }
        const notification = document.querySelector('.main__notification');
        document.querySelector('.main__notification__new-letter').textContent = 'Новое письмо';
        document.querySelector('.main__notification__counter').textContent = `Непрочитанных писем: ${text}`;

        notification.classList.add('opaque')

        setTimeout(() => {
            notification.classList.remove('opaque')
        }, 3000);
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
            },
            folder: {
                button: document.querySelector('#move-to'),
                dropdown: document.querySelector('.main__header__dropdown__wrapper'),
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
    }

    /**
     * Функция отображения хедера
     */
    handleHeader() {
        const unselectedButtons = {
            select_all: document.querySelector('#select-all'),
            mark_all_as_read: document.querySelector('#mark-all-as-read'),
        };
        const selectedButtons = {
            deselect: document.querySelector('#deselect'),
            delete: document.querySelector('#delete'),
            move_to: document.querySelector('#move-to'),
            spam: document.querySelector('#spam'),
            mark_as_read: document.querySelector('#mark-as-read'),
            mark_as_unread: document.querySelector('#mark-as-unread'),
        };
        if (this.#config.folderNumber) {
            selectedButtons.move_from = document.querySelector('#move-from');
        }

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
     * Функция отметки всех писем непрочитанными
     */
    handleMarkAllAsRead = (e) => {
        this.hideError();
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

    /**
     * Функция удаления письма
     */
    handleDelete = (e) => {
        console.log('delete');
        this.hideError();
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

    /**
     * Функция удаления письма из папки
     */
    handleDeleteFolder = (e) => {
        this.hideError();
        e.preventDefault();
        this.selectedListLetters.forEach(item => {
            const value = {
                emailId: Number(item.dataset.id),
                folderId: Number(this.#config.folderNumber),
            }
            dispathcher.do(actionDeleteLetterFromFolder(value));
        });
        this.handleDeselect(e);
        this.handleHeader();
    }

    /**
     * Функция отметки выделенных писем прочитанными
     */
    handleMarkAsRead = (e) => {
        this.hideError();
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

    /**
     * Функция отметки выделенных писем спамом
     */
    handleSpam = (e) => {
        this.hideError();
        e.preventDefault();
        const selectedIds = this.selectedListLetters.map(letter => letter.dataset.id);
        const letters = this.#config.content.list_letters;
        letters.forEach(item => {
            if (selectedIds.includes(String(item.id))) {
                item.spamStatus = !item.spamStatus;
                dispathcher.do(actionUpdateEmail(item.id, item, true));
            }
        })
        this.handleDeselect(e);
        this.handleHeader();
    }

    /**
     * Функция отметки выделенных писем непрочитанными
     */
    handleMarkAsUnread = (e) => {
        this.hideError();
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
     * Функция перемещения письма в папку
     */
    handleSaveFolder = (e, id) => {
        this.hideError();
        e.preventDefault();
        this.selectedListLetters.forEach(item => {
            const value = {
                emailId: Number(item.dataset.id),
                folderId: Number(id),
            }
            dispathcher.do(actionAddLetterToFolder(value));
        });
        this.handleDeselect(e);
        this.handleHeader();
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#config.menu.component.addListeners();
        this.#config.header.component.addListeners();

        this.#parent.querySelectorAll('.main__folder').forEach((folder) => {
            folder.addEventListener('click', (e) => this.handleSaveFolder(e, folder.dataset.id));
        })

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
        if (this.#config.folderNumber) {
            this.#parent
                .querySelector('#move-from')
                .addEventListener('click', this.handleDeleteFolder);
        }
        this.#parent
            .querySelector('#mark-as-read')
            .addEventListener('click', this.handleMarkAsRead);
        this.#parent
            .querySelector('#spam')
            .addEventListener('click', this.handleSpam);
        this.#parent
            .querySelector('#mark-as-unread')
            .addEventListener('click', this.handleMarkAsUnread);



        this.#parent
            .querySelectorAll('.list-letter').forEach((letter) => {
                letter.addEventListener('click', (e) => this.handleLetter(e, letter.dataset.id));
            });

        this.#parent.addEventListener('click', this.handleDropdowns);
        mediator.on('updateEmail', this.handleUpdateEmailResponse);
        mediator.on('updateSpam', this.handleSpamResponse);
        mediator.on('deleteEmail', this.handleDeleteEmailResponse);
        mediator.on('addLetterToFolder', this.handleAddEmailToFolderResponse);
        mediator.on('webSocketListLettersUpdate', this.handleWebSocketListLettersUpdate);

    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#config.menu.component.removeListeners();

        this.#parent.querySelectorAll('.main__folder').forEach((folder) => {
            folder.removeEventListener('click', (e) => this.handleSaveFolder(e, folder.dataset.id));
        })
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
        if (this.#config.folderNumber) {
            this.#parent
                .querySelector('#move-from')
                .removeEventListener('click', this.handleDeleteFolder);
        }
        this.#parent
            .querySelector('#mark-as-read')
            .removeEventListener('click', this.handleMarkAsRead);
        this.#parent
            .querySelector('#spam')
            .removeEventListener('click', this.handleSpam);
        this.#parent
            .querySelector('#mark-as-unread')
            .removeEventListener('click', this.handleMarkAsUnread);



        this.#parent
            .querySelectorAll('.list-letter').forEach((letter) => {
                letter.removeEventListener('click', (e) => this.handleLetter(e, letter.dataset.id));
            });

        this.#parent.removeEventListener('click', this.handleDropdowns);
        mediator.off('updateEmail', this.handleUpdateEmailResponse);
        mediator.off('updateSpam', this.handleSpamResponse);
        mediator.off('deleteEmail', this.handleDeleteEmailResponse);
        mediator.off('addLetterToFolder', this.handleAddEmailToFolderResponse);
        mediator.off('webSocketListLettersUpdate', this.handleWebSocketListLettersUpdate);


    }

    /**
     * Функция обработки ответа на запрос обновления письма
     */
    handleUpdateEmailResponse = (status) => {
        const counter = this.#parent.querySelector('.menu__default-folder__counter');
        const error = this.#parent.querySelector('.letter__error');
        switch (status) {
            case 200:
                if (emailStore.incoming_count > 0) {
                    counter.textContent = emailStore.incoming_count;
                } else {
                    counter.textContent = '';
                }
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

    /**
     * Функция обработки ответа на запрос добавления письма в спам
     */
    handleSpamResponse = (status) => {
        const error = this.#parent.querySelector('.letter__error');
        switch (status) {
            case 200:
                if (this.#config.spam) {
                    dispathcher.do(actionRedirect('/main', true));
                } else {
                    dispathcher.do(actionRedirect('/main', false));
                }
                break;
            default:
                error.textContent = 'Проблема на нашей стороне, уже исправляем';
                error.classList.add('appear');
                break;
        }
    }

    /**
     * Функция обработки ответа на запрос добавления письма в папку
     */
    handleAddEmailToFolderResponse = ({ status, id }) => {
        const error = this.#parent.querySelector('.letter__error');

        switch (status) {
            case 200:
                dispathcher.do(actionRedirectToLetter(id, true, true));
                break;
            default:
                error.textContent = 'Проблема на нашей стороне, уже исправляем';
                error.classList.add('appear');
                break;
        }
    }

    handleWebSocketListLettersUpdate = (value) => {
        document.querySelector('.list-letters').insertAdjacentHTML('afterbegin', value);
        this.#parent
        .querySelectorAll('.list-letter').forEach((letter) => {
            letter.removeEventListener('click', (e) => this.handleLetter(e, letter.dataset.id));
        });
        this.#parent
        .querySelectorAll('.list-letter').forEach((letter) => {
            letter.addEventListener('click', (e) => this.handleLetter(e, letter.dataset.id));
        });
        if (emailStore.incoming_count > emailStore.old_incoming_count) {
            emailStore.old_incoming_count = emailStore.incoming_count;
            this.notification(emailStore.incoming_count)
        }
    }
}
