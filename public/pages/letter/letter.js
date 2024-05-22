import Menu from '../../components/menu/menu.js';
import Header from '../../components/header/header.js';
import dispathcher from '../../modules/dispathcher.js';
import mediator from '../../modules/mediator.js';
import { actionLogout, actionRedirect, actionUpdateEmail, actionDeleteEmail, actionAddLetterToFolder, actionRedirectToLetter, actionDeleteLetterFromFolder } from '../../actions/userActions.js';
import template from './letter.hbs'
import router from '../../modules/router.js';
import userStore from '../../stores/userStore.js';
import List_attachment from '../../components/list-attachment/list-attachment.js';
import List_attachments from '../../components/list-attachments/list-attachments.js';


//const MAX_INPUT_LENGTH = 64;


/**
 * Класс страницы
 * @class
 */
export default class Letter {
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

    #calculateFilesNumber = (number) => {
        let numberLabel = '';
        if ((number % 10 === 1) && (number % 100 !== 11)) {
            numberLabel = `${number} файл`;
        } else {
            if ((number % 10 === 2 || number % 10 === 3 || number % 10 === 4) && (number % 100 !== 12) && (number % 100 !== 13) && (number % 100 !== 14)) {
                numberLabel = `${number} файла`;
            } else {
                numberLabel = `${number} файлов`;
            }
        }
        return numberLabel;
    }

    #calculateTotalSize = (files) => {
        let result = 0;
        files.forEach((file) => {
            result += file.id;
        });
        return result;
    }

    /**
     * Рендер компонента в DOM
     */
    render() {
        const config = this.#config;
        this.#config.menu.component = new Menu(this.#parent, this.#config.menu);
        const elements = {
            status: this.#config.email.readStatus,
            avatar: this.#config.email.photoId,
            from: this.#config.email.senderEmail,
            subject: this.#config.email.topic,
            text: this.#config.email.text,
            date: (new Date(this.#config.email.dateOfDispatch)).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),

            draft: this.#config.email.draftStatus,
            id: this.#config.email.id,
            replyId: this.#config.email.replyToEmailId,
            replyTopic: this.#config.replyEmail?.topic,
            userLetter: this.#config.email.senderEmail.charAt(0),
            header: new Header(null, config.header).render(),
            menu: this.#config.menu.component.render(),
            folders: this.#config.menu.folders,
            list_attachments: new List_attachments(null, this.#config.files).render(),
            files_number: this.#calculateFilesNumber(this.#config.files.length),
            total_size: this.#calculateTotalSize(this.#config.files)
        };
        if (elements.from === userStore.body.login) {
            elements.from = this.#config.email.recipientEmail;
            elements.userLetter = this.#config.email.recipientEmail.charAt(0)
        }
        elements.delete_folders = this.#config.menu.letter_folders;
        elements.delete_folders.forEach((delete_folder) => {
            elements.folders = elements.folders.filter((folder) => folder.id !== delete_folder.id);
        })
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
        if (elements.draft) {
            this.#parent.querySelectorAll('.letter__header__button').forEach((element) => {
                element.style.display = 'none'
            });
            this.#parent.querySelector('#changeDraft').style.display = 'grid';
        } else {
            this.#parent.querySelectorAll('.letter__header__button').forEach((element) => {
                element.style.display = 'grid'
            });
            this.#parent.querySelector('#changeDraft').style.display = 'none';
        }
        this.#parent.querySelector('#back').style.display = 'grid';
        this.#parent.querySelector('#delete').style.display = 'grid';
        const btn = this.#parent.querySelector('#to-spam');
        if (this.#config.email.spamStatus === true) {
            btn.style.backgroundColor = '#393939';
        } else {
            btn.style.backgroundColor = '#191919';
        }
    }

    /**
     * Функция регуляции отображения ошибки
     */
    hideError = () => {
        const oldError = this.#parent
            .querySelector('.letter__error');
        oldError.classList.remove('appear');
    };

    /**
     * Фунция перехода на страницу статистики
     */
    handleStat = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/stat', true));
    };

    /**
     * Функция, регулирующая отображения всех всплывающих окон на странице
     */
    handleDropdowns(e) {
        const target = e.target;

        let elements = {
            profile: {
                button: document.querySelector('.header__avatar'),
                dropdown: document.querySelector('.header__dropdown'),
            },
            folder: {
                button: document.querySelector('#to-folder'),
                dropdown: document.querySelector('#save-wrapper'),
            },
            delete_folder: {
                button: document.querySelector('#from-folder'),
                dropdown: document.querySelector('#delete-wrapper'),
            },

        }
        if (document.querySelector('.letter__attachments__view-button')) {
            elements['files'] = {
                button: document.querySelector('.letter__attachments__view-button'),
                dropdown: document.querySelector('.letter__attachments__dropdown__wrapper'),
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
     * Функция выхода из аккаунта
     */
    handleExit = async (e) => {
        e.preventDefault();
        await dispathcher.do(actionLogout());
    };

    /**
     * Функция перехода на страницу профиля
     */
    handleProfile = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/profile', true));
    };

    /**
     * Функция перессылки письма
     */
    handleResend = (e) => {
        e.preventDefault();
        const topic = this.#parent
            .querySelector('.letter__subject').textContent.trim();
        const sender = this.#parent
            .querySelector('.letter__info__from').textContent.trim();
        const date = this.#parent
            .querySelector('.letter__info__date').textContent.trim();
        const text = this.#parent
            .querySelector('.letter__text').textContent.trim();
        dispathcher.do(actionRedirect('/write_letter', true, { resend: true, topic: topic, sender: sender, date: date, text: text }));
    };

    /**
     * Функция редактирования черновика
     */
    handleChangeDraft = (e) => {
        e.preventDefault();
        const topic = this.#parent
            .querySelector('.letter__subject').textContent.trim();
        const sender = this.#parent
            .querySelector('.letter__info__from').textContent.trim();
        const date = this.#parent
            .querySelector('.letter__info__date').textContent.trim();
        const text = this.#parent
            .querySelector('.letter__text').textContent.trim();
        dispathcher.do(actionRedirect('/write_letter', true, { changeDraft: true, topic: topic, sender: sender, date: date, text: text, id: this.#config.email.id }));
    };

    /**
     * Функция ответа на письмо
     */
    handleReply = (e) => {
        e.preventDefault();
        const topic = this.#parent
            .querySelector('.letter__subject').textContent.trim();
        const sender = this.#parent
            .querySelector('.letter__info__from').textContent.trim();
        const date = this.#parent
            .querySelector('.letter__info__date').textContent.trim();
        const text = this.#parent
            .querySelector('.letter__text').textContent.trim();
        dispathcher.do(actionRedirect('/write_letter', true, { topic: topic, sender: sender, date: date, text: text, replyId: this.#config.email.id, replySender: this.#config.email.senderEmail }));
    };

    /**
     * Функция отметки одного письма прочитанным/непрочитанным
     */
    handleStatus = async (e) => {
        this.hideError();
        e.preventDefault();
        const id = this.#config.email.id;
        const value = this.#config.email;
        const icon = document.querySelector('.letter__info__icon');

        if (icon.src.endsWith("/icons/read-on-offer__256.svg")) {
            icon.src = '/icons/read-on__256.svg';
        } else {
            icon.src = '/icons/read-on-offer__256.svg';
        }
        value.readStatus = !value.readStatus;
        dispathcher.do(actionUpdateEmail(id, value));
    }

    /**
     * Фунция отметки выделенных писем прочитанными
     */
    handleMarkAsRead = async (e) => {
        this.hideError();
        e.preventDefault();
        const id = this.#config.email.id;
        const value = this.#config.email;
        const icon = document.querySelector('.letter__info__icon');
        if (value.readStatus === false) {
            value.readStatus = true;
            icon.src = '/icons/read-on-offer__256.svg';
            dispathcher.do(actionUpdateEmail(id, value));
        }
    }

    /**
     * Функция отметки письма спамом
     */
    handleSpam = async (e) => {
        this.hideError();
        e.preventDefault();
        const id = this.#config.email.id;
        const value = this.#config.email;
        const btn = this.#parent.querySelector('#to-spam');
        if (Boolean(value.spamStatus) === false) {
            btn.style.backgroundColor = '#393939';
        } else {
            btn.style.backgroundColor = '#191919';
        }
        value.spamStatus = !value.spamStatus;
        dispathcher.do(actionUpdateEmail(id, value, true));
    }

    /**
     * Функция отметки выделенных писем непрочитанными
     */
    handleMarkAsUnread = async (e) => {
        this.hideError();
        e.preventDefault();
        const id = this.#config.email.id;
        const value = this.#config.email;
        const icon = document.querySelector('.letter__info__icon');
        if (value.readStatus === true) {
            value.readStatus = false;
            icon.src = '/icons/read-on__256.svg';
            dispathcher.do(actionUpdateEmail(id, value));
        }
    }

    /**
     * Функция удаления писем
     */
    handleDelete = async (e) => {
        this.hideError();
        e.preventDefault();
        const id = this.#config.email.id;
        dispathcher.do(actionDeleteEmail(id));
    }

    /**
     * Функция перехода на предыдущую страницу
     */
    handleBack = async (e) => {
        e.preventDefault();
        this.removeListeners();
        if (router.canGoBack() > 1) {
            window.history.back();
        }
    }

    // handleFolder = (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     this.#parent.querySelector('.letter__header__dropdown__wrapper').classList.add('show');
    // }

    /**
     * Функция перемещения письма в папку
     */
    handleSaveFolder = async (e, id) => {
        e.preventDefault();
        const value = {
            emailId: this.#config.email.id,
            folderId: Number(id),
        }
        dispathcher.do(actionAddLetterToFolder(value));
    };

    handleDeleteFolder = async (e, id) => {
        e.preventDefault();
        const value = {
            emailId: this.#config.email.id,
            folderId: Number(id),
        }
        dispathcher.do(actionDeleteLetterFromFolder(value));
    };

    /**
     * Функция всплывания окна меню для мобильной версии
     */
    handleRollUpMenu = (e) => {
        e.preventDefault();
        const menu = document.querySelector('.menu');
        if (menu.classList.contains('appear')) {
            menu.classList.remove('appear');
        } else {
            menu.classList.add('appear');
        }
    }

    downloadURI = async (url, filename) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }


    downloadAttachment = async (e, id) => {
        e.preventDefault();
        const attachment = this.#config.files.find(item => item.id == id);
        const url = attachment.fileId;
        const fileName = attachment.id;
        await this.downloadURI(url, fileName);
    }

    downloadAllAttachments = async (e) => {
        for (let attachment of this.#config.files) {
            this.downloadAttachment(e, attachment.id);
        }
    }


    notifyMe = () => {
        console.log("notify");
        if (!("Notification" in window)) {
            // Check if the browser supports notifications
            alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            // Check whether notification permissions have already been granted;
            // if so, create a notification
            const notification = new Notification("Hi there!");
            // …
        } else if (Notification.permission !== "denied") {
            // We need to ask the user for permission
            Notification.requestPermission().then((permission) => {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    const notification = new Notification("Hi there!");
                    // …
                }
            });
        } else {
            console.log('huitea');
        }

        // At last, if the user has denied notifications, and you
        // want to be respectful there is no need to bother them anymore.
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {

        this.#parent
            .querySelector('.letter__info__from')
            .addEventListener('click', this.notifyMe);

        this.#parent
            .querySelectorAll('.list-attachment').forEach((file) => {
                file.querySelector('.list-attachment__delete-button').
                    addEventListener('click', (e) => this.downloadAttachment(e, file.dataset.id));
            })
        this.#parent
            ?.querySelector('.letter__attachments__download-all-button')
            ?.addEventListener('click', this.downloadAllAttachments);

        this.#parent
            .querySelector('.header__rollup-button')
            .addEventListener('click', this.handleRollUpMenu);
        this.#config.menu.component.addListeners();
        this.#parent.querySelectorAll('.letter__folder-save').forEach((folder) => {
            folder.addEventListener('click', (e) => this.handleSaveFolder(e, folder.dataset.id));
        });
        this.#parent.querySelectorAll('.letter__folder-delete').forEach((folder) => {
            folder.addEventListener('click', (e) => this.handleDeleteFolder(e, folder.dataset.id));
        });
        this.#parent
            .querySelector('.letter__info__icon')
            .addEventListener('click', this.handleStatus);
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .addEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.header__dropdown__profile-button')
            .addEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('#delete')
            .addEventListener('click', this.handleDelete);
        this.#parent
            .querySelector('.header__dropdown__stat-button')
            .addEventListener('click', this.handleStat);
        this.#parent
            .querySelector('#mark-as-read')
            .addEventListener('click', this.handleMarkAsRead);
        this.#parent
            .querySelector('#mark-as-unread')
            .addEventListener('click', this.handleMarkAsUnread);
        this.#parent
            .querySelector('#to-spam')
            .addEventListener('click', this.handleSpam);
        this.#parent
            .querySelector('#resend')
            .addEventListener('click', this.handleResend);
        this.#parent
            .querySelector('#reply')
            .addEventListener('click', this.handleReply);
        this.#parent
            .querySelector('#changeDraft')
            .addEventListener('click', this.handleChangeDraft);
        this.#parent.
            querySelector('.letter__header__back-button')
            .addEventListener('click', this.handleBack);
        // this.#parent.
        //     querySelector('#to-folder')
        //     .addEventListener('click', this.handleFolder);
        this.#parent.addEventListener('click', this.handleDropdowns);
        mediator.on('logout', this.handleExitResponse);
        mediator.on('updateEmail', this.handleUpdateEmailResponse);
        mediator.on('updateSpam', this.handleDeleteEmailResponse);
        mediator.on('deleteEmail', this.handleDeleteEmailResponse);
        mediator.on('addLetterToFolder', this.handleAddEmailToFolderResponse);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#config.menu.component.removeListeners();
        this.#parent
            .querySelector('.letter__info__icon')
            .removeEventListener('click', this.handleStatus);
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .removeEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.header__dropdown__profile-button')
            .removeEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('#delete')
            .removeEventListener('click', this.handleDelete);
        this.#parent
            .querySelector('#mark-as-read')
            .removeEventListener('click', this.handleMarkAsRead);
        this.#parent
            .querySelector('#to-spam')
            .removeEventListener('click', this.handleSpam);
        this.#parent
            .querySelector('.header__dropdown__stat-button')
            .removeEventListener('click', this.handleStat);
        this.#parent
            .querySelector('#mark-as-unread')
            .removeEventListener('click', this.handleMarkAsUnread);
        this.#parent
            .querySelector('#resend')
            .removeEventListener('click', this.handleResend);
        this.#parent
            .querySelector('#reply')
            .removeEventListener('click', this.handleReply);
        this.#parent
            .querySelector('#changeDraft')
            .removeEventListener('click', this.handleChangeDraft);
        this.#parent.
            querySelector('.letter__header__back-button')
            .removeEventListener('click', this.handleBack);
        // this.#parent.
        //     querySelector('#to-folder')
        //     .removeEventListener('click', this.handleFolder);
        this.#parent.removeEventListener('click', this.handleDropdowns);
        mediator.off('logout', this.handleExitResponse);
        mediator.off('updateEmail', this.handleUpdateEmailResponse);
        mediator.off('updateSpam', this.handleDeleteEmailResponse);
        mediator.off('deleteEmail', this.handleDeleteEmailResponse);
        mediator.off('addLetterToFolder', this.handleAddEmailToFolderResponse);
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
     * Функция обработки ответа на запрос изменения письма
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
                dispathcher.do(actionRedirect('/main', true));
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
        switch (status) {
            case 200:
                dispathcher.do(actionRedirectToLetter(id, true, true));
                break;
            default:
                break;
        }
    }
}
