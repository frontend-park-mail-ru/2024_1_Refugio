import Menu from '../../components/menu/menu.js';
import Header from '../../components/header/header.js';
import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionBindAttachmnetsToLetter, actionRedirect, actionSend, actionAttachFile, actionDeleteAttachment } from '../../actions/userActions.js';
import { actionTypingAddDraft, actionAddDraft, actionSendDraft, actionUpdateDraft, actionTypingUpdateDraft } from '../../actions/draftActions.js';

import mediator from '../../modules/mediator.js';
import template from './write-letter.hbs'
import router from '../../modules/router.js';
import WriteLetterView from '../../views/write-letter.js'
import debounce from '../../modules/debounce.js';
import List_attachments from '../../components/list-attachments/list-attachments.js'
import throttle from '../../modules/throttle.js'


const MAX_INPUT_LENGTH = 64;


/**
 * Класс обертки страницы
 * @class
 */
export default class Write__Letter {
    #parent;
    #config;
    #sendStatus;

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

    registerHelper(text) {
        let lines = text.split('\n');
        lines = lines.map(line => '\t' + line);
        return lines.join('\n');
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
            result += Number(file.fileSize) / 1048576;
        });
        return String(result).substring(0, 4);
    }


    /**
     * Рендер компонента в DOM
     */
    render() {
        const config = this.#config;
        this.#config.menu.component = new Menu(this.#parent, this.#config.menu);
        this.#config.header.component = new Header(this.#parent, this.#config.header);

        const elements = {
            id: this.#config.values?.id,
            resend: this.#config.values?.resend,
            changeDraft: this.#config.values?.changeDraft,
            sender: this.#config.values?.sender,
            date: this.#config.values?.date,
            topic: this.#config.values?.topic,
            text: this.#config.values?.text,
            replyId: this.#config.values?.replyId,
            replySender: this.#config.values?.replySender,
            header: this.#config.header.component.render(),
            menu: this.#config.menu.component.render(),

        };

        if (this.#config.files) {
            elements.list_attachments = new List_attachments(null, this.#config.files).render(),
                elements.files_number = this.#calculateFilesNumber(this.#config.files.length),
                elements.total_size = this.#calculateTotalSize(this.#config.files)
        }
        if (this.#config.values?.text && !this.#config.values?.changeDraft) {
            elements.text = this.registerHelper(this.#config.values?.text);
        }
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    /**
     * Функция авторизации
     */

    handleSaveForm = async (e) => {
        e.preventDefault();

    };

    /**
     * Функция вызова logout действия
     */
    handleExit = async (e) => {
        e.preventDefault();
        await dispathcher.do(actionLogout());
    };

    handleProfile = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/profile', true));
    };

    handleStat = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/stat', true));
    };

    handleDraft = async (e) => {
        e.preventDefault();
        const toInput = document.querySelector('.write-letter__to__input');
        const topicInput = document.querySelector('.write-letter__subject__input');
        const textInput = document.querySelector('.write-letter__text');

        const to = toInput.value.trim();
        let topic = topicInput.value.trim();
        let text = textInput.value.trim();

        if (!topic) {
            topic = "Без темы";
        }

        if (!text) {
            text = "Пустое письмо";
        }

        const newLetter = {
            readStatus: false,
            draftStatus: true,
            topic: topic,
            text: text,
            recipientEmail: to,
            senderEmail: this.#config.user.login,
        };
        if (this.#config.values?.replyId) {
            newLetter.replyToEmailId = this.#config.values.replyId;
        }
        dispathcher.do(actionAddDraft(newLetter));
        this.#sendStatus = true;
    };


    handleSend = async (e) => {
        e.preventDefault();
        const toInput = document.querySelector('.write-letter__to__input');
        const topicInput = document.querySelector('.write-letter__subject__input');
        const textInput = document.querySelector('.write-letter__text');

        const to = toInput.value.trim();
        let topic = topicInput.value.trim();
        let text = textInput.value.trim();

        let oldError = this.#parent
            .querySelector('.write-letter__to__error');
        oldError.classList.remove('appear');
        oldError = toInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('.write-letter__subject__error');
        oldError.classList.remove('appear');
        oldError = topicInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('.write-letter__buttons__error');
        oldError.classList.remove('show');

        oldError = this.#parent
            .querySelector('.write-letter__attachments__error');
        oldError.classList.remove('show');

        let isValidForm = true;
        const toError = this.#parent.querySelector('.write-letter__to__error');
        if (!to) {
            toError.textContent = "Введите получателя";
            toError.classList.add('appear');
            toInput.classList.add('input-background-error');
            isValidForm = false;
        } else {
            if (to.length > MAX_INPUT_LENGTH) {
                toError.textContent = "Слишком длинное имя ящика получателя";
                toError.classList.add('appear');
                toInput.classList.add('input-background-error');
                isValidForm = false;
            } else {
                if (to.indexOf('@') === -1) {
                    toError.textContent = "Забыли \"@\"";
                    toError.classList.add('appear');
                    toInput.classList.add('input-background-error');
                    isValidForm = false;
                } else {
                    if (to.indexOf('.') === -1) {
                        toError.textContent = "Забыли \".\"";
                        toError.classList.add('appear');
                        toInput.classList.add('input-background-error');
                        isValidForm = false;
                    } else {
                        const toRegex = /^[a-zA-Z0-9._%+-]+@.+\..+$/;
                        if (!toRegex.test(to)) {
                            toError.textContent = "Некорректное имя ящика получателя";
                            toError.classList.add('appear');
                            toInput.classList.add('input-background-error');
                            isValidForm = false;
                        }
                    }
                }
            }
        }

        const topicError = this.#parent.querySelector('.write-letter__subject__error');
        if (topic.length > MAX_INPUT_LENGTH) {
            topicError.textContent = "Слишком длинная тема";
            topicError.classList.add('appear');
            topicInput.classList.add('input-background-error');
            isValidForm = false;
        }

        if (!isValidForm) {
            return;
        }

        if (!topic) {
            topic = "Без темы";
        }

        if (!text) {
            text = "Пустое письмо";
        }


        const newLetter = {
            readStatus: false,
            topic: topic,
            text: text,
            recipientEmail: to,
            senderEmail: this.#config.user.login,
        };
        if (this.#config.values?.replyId) {
            newLetter.replyToEmailId = this.#config.values.replyId;
        }

        dispathcher.do(actionSend(newLetter));
        this.#sendStatus = true;
    };

    handleDraftUpdate = async (e) => {
        e.preventDefault();
        const toInput = document.querySelector('.write-letter__to__input');
        const topicInput = document.querySelector('.write-letter__subject__input');
        const textInput = document.querySelector('.write-letter__text');

        const to = toInput.value.trim();
        let topic = topicInput.value.trim();
        let text = textInput.value.trim();

        if (!topic) {
            topic = "Без темы";
        }

        if (!text) {
            text = "Пустое письмо";
        }

        const newLetter = {
            readStatus: false,
            topic: topic,
            text: text,
            recipientEmail: to,
            senderEmail: this.#config.user.login,
            draftStatus: true,
        };
        if (this.#config.values?.replyId) {
            newLetter.replyToEmailId = this.#config.values.replyId;
        }
        dispathcher.do(actionUpdateDraft(this.#config.values?.id, newLetter));
        this.#sendStatus = true;
    };


    handleSendUpdate = async (e) => {
        e.preventDefault();
        const toInput = document.querySelector('.write-letter__to__input');
        const topicInput = document.querySelector('.write-letter__subject__input');
        const textInput = document.querySelector('.write-letter__text');

        const to = toInput.value.trim();
        let topic = topicInput.value.trim();
        let text = textInput.value.trim();

        let oldError = this.#parent
            .querySelector('.write-letter__to__error');
        oldError.classList.remove('appear');
        oldError = toInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('.write-letter__subject__error');
        oldError.classList.remove('appear');
        oldError = topicInput;
        oldError.classList.remove('input-background-error');

        oldError = this.#parent
            .querySelector('.write-letter__buttons__error');
        oldError.classList.remove('show');

        oldError = this.#parent
            .querySelector('.write-letter__attachments__error');
        oldError.classList.remove('show');

        let isValidForm = true;
        const toError = this.#parent.querySelector('.write-letter__to__error');
        if (!to) {
            toError.textContent = "Введите получателя";
            toError.classList.add('appear');
            toInput.classList.add('input-background-error');
            isValidForm = false;
        } else {
            if (to.length > MAX_INPUT_LENGTH) {
                toError.textContent = "Слишком длинное имя ящика получателя";
                toError.classList.add('appear');
                toInput.classList.add('input-background-error');
                isValidForm = false;
            } else {
                if (to.indexOf('@') === -1) {
                    toError.textContent = "Забыли \"@\"";
                    toError.classList.add('appear');
                    toInput.classList.add('input-background-error');
                    isValidForm = false;
                } else {
                    if (to.indexOf('.') === -1) {
                        toError.textContent = "Забыли \".\"";
                        toError.classList.add('appear');
                        toInput.classList.add('input-background-error');
                        isValidForm = false;
                    } else {
                        const toRegex = /^[a-zA-Z0-9._%+-]+@.+\..+$/;
                        if (!toRegex.test(to)) {
                            toError.textContent = "Некорректное имя ящика получателя";
                            toError.classList.add('appear');
                            toInput.classList.add('input-background-error');
                            isValidForm = false;
                        }
                    }
                }
            }
        }

        const topicError = this.#parent.querySelector('.write-letter__subject__error');
        if (topic.length > MAX_INPUT_LENGTH) {
            topicError.textContent = "Слишком длинная тема";
            topicError.classList.add('appear');
            topicInput.classList.add('input-background-error');
            isValidForm = false;
        }

        if (!isValidForm) {
            return;
        }

        if (!topic) {
            topic = "Без темы";
        }

        if (!text) {
            text = "Пустое письмо";
        }


        const newLetter = {
            readStatus: false,
            topic: topic,
            text: text,
            recipientEmail: to,
            senderEmail: this.#config.user.login,
        };
        if (this.#config.values?.replyId) {
            newLetter.replyToEmailId = this.#config.values.replyId;
        }
        dispathcher.do(actionSendDraft(this.#config.values?.id, newLetter));
        this.#sendStatus = true;
    };

    handleDropdowns(e) {
        const target = e.target;

        const elements = {
            profile: {
                button: document.querySelector('.header__avatar'),
                dropdown: document.querySelector('.header__dropdown'),
            },
            files: {
                button: document.querySelector('.write-letter__attachments__view-button'),
                dropdown: document.querySelector('.write-letter__attachments__dropdown__wrapper'),
            }
        }
        if (document.querySelector('.from-letter__attachments__view-button')) {
            elements['files'] = {
                button: document.querySelector('.from-letter__attachments__view-button'),
                dropdown: document.querySelector('.from-letter__attachments__dropdown__wrapper'),
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

    handleBack = async (e) => {
        e.preventDefault();
        if (router.canGoBack() > 1) {
            window.history.back();
        }
        document
            .querySelector('.write-letter__buttons__cancel-button')
            .removeEventListener('click', this.handleBack);
    }




    createNewAttachment = (fileName, fileSize, id) => {
        fileSize = fileSize / 1048576;
        fileSize = String(fileSize).substring(0, 3) + ' МБ';
        const newAttachment = document.createElement('div');
        newAttachment.setAttribute('class', 'write-letter__attachments__dropdown__file');
        newAttachment.setAttribute('data-id', id);

        const name = document.createElement('div');
        name.setAttribute('class', 'write-letter__attachments__dropdown__file__name');
        name.textContent = fileName;
        newAttachment.appendChild(name);

        const size = document.createElement('div');
        size.setAttribute('class', 'write-letter__attachments__dropdown__file__size');
        size.textContent = fileSize;
        newAttachment.appendChild(size);

        const deleteButton = document.createElement('div');
        deleteButton.setAttribute('class', 'write-letter__attachments__dropdown__file__delete-button');
        deleteButton.textContent = "Удалить";
        deleteButton.addEventListener('click', (e) => this.deleteAttachment(e, id));
        newAttachment.appendChild(deleteButton);

        return newAttachment;
    }

    attachments = [];
    currentFile;
    addAttachmentIsRunning = false;

    addAttachment = async () => {
        if (this.addAttachmentIsRunning) {
            return
        }
        this.addAttachmentIsRunning = true;

        const oldError = this.#parent
            .querySelector('.write-letter__attachments__error');
        oldError.classList.remove('show');

        const input = this.#parent.querySelector('.write-letter__attachments__attach-input');
        let isCancelled = false;

        const handleFileProcessing = async () => {
            if (isCancelled) {
                return;
            }
            input.removeEventListener('change', handleFileProcessing);
            const file = input.files[0];
            this.currentFile = file;

            input.removeEventListener('change', handleFileProcessing);
            document
                .querySelector('.write-letter__attachments__attach-button')
                .removeEventListener('click', this.addAttachmentThrottled);


            const error = this.#parent
                .querySelector('.write-letter__attachments__error');
            if (file.size > 20 * 1024 * 1024) {
                error.textContent = 'Файл превышает максимальный размер 20 МБ';
                error.classList.add('show');
                this.addAttachmentIsRunning = false
                return;
            }


            document.querySelector('.write-letter__attachments__attach-button').textContent = 'Загрузка файла';


            const formData = new FormData();
            formData.append('file', input.files[0]);
            dispathcher.do(actionAttachFile(formData))
        };
        input.removeEventListener('change', handleFileProcessing);
        input.value = '';
        input.addEventListener('change', handleFileProcessing);
        const cancelListener = () => {
            isCancelled = true;
            input.removeEventListener('change', handleFileProcessing);
            this.addAttachmentIsRunning = false;
        };
        input.addEventListener('cancel', cancelListener);
        input.click();
    }

    addAttachmentThrottled = throttle(this.addAttachment, 1000);







    renderAttachment = (id) => {
        const file = this.currentFile;
        this.attachments.push({ file, id });
        const viewButton = this.#parent.querySelector('.write-letter__attachments__view-button');
        const deleteAllButton = this.#parent.querySelector('.write-letter__attachments__delete-all-button');

        const numberOfFiles = this.attachments.length;


        if (numberOfFiles === 1) {
            viewButton.classList.add('appear');
            deleteAllButton.classList.add('appear');
        }

        const newAttachment = this.createNewAttachment(file.name, file.size, id);

        const attachmentsList = this.#parent.querySelector('.write-letter__attachments__dropdown');
        attachmentsList.appendChild(newAttachment);

        const numberOfFilesLabel = this.#parent.querySelector('.write-letter__attachments__view-button__label');
        const attachmentsTotalSize = this.#parent.querySelector('.write-letter__attachments__view-button__counter');

        if ((numberOfFiles % 10 === 1) && (numberOfFiles % 100 !== 11)) {
            numberOfFilesLabel.textContent = `${numberOfFiles} файл`;
        } else {
            if ((numberOfFiles % 10 === 2 || numberOfFiles % 10 === 3 || numberOfFiles % 10 === 4) && (numberOfFiles % 100 !== 12) && (numberOfFiles % 100 !== 13) && (numberOfFiles % 100 !== 14)) {
                numberOfFilesLabel.textContent = `${numberOfFiles} файла`;
            } else {
                numberOfFilesLabel.textContent = `${numberOfFiles} файлов`;
            }
        }


        let fileSize = file.size;
        fileSize = fileSize / 1048576;
        if (attachmentsTotalSize.textContent === '') {
            attachmentsTotalSize.textContent = String(fileSize).substring(0, 4) + ' МБ';
        } else {
            const prevTotalSize = attachmentsTotalSize.textContent.substring(0, (attachmentsTotalSize.textContent).length - 3);
            attachmentsTotalSize.textContent = String(Number(prevTotalSize) + fileSize).substring(0, 4) + ' МБ';
        }
        if (this.#config.values?.changeDraft) {
            this.handleTypingDraftUpdateDebounced();
        } else {
            this.handleTypingDraftDebounced();
        }
    }

    deleteAllAttachments = async (e) => {
        for (let attachment of this.attachments) {
            this.deleteAttachment(e, attachment.id);
        }
    }

    deleteAttachment = async (e, id) => {
        e.preventDefault();
        const oldError = this.#parent
            .querySelector('.write-letter__attachments__error');
        oldError.classList.remove('show');
        dispathcher.do(actionDeleteAttachment(id));
    }

    renderDeleteAttachment = (id) => {
        const object = this.attachments.find(item => item.id === id);
        this.attachments = this.attachments.filter(item => item.id !== id);
        const attachment = document.querySelectorAll(`[data-id="${object.id}"]`)[0];
        const attachmentsList = this.#parent.querySelector('.write-letter__attachments__dropdown');
        attachmentsList.removeChild(attachment);
        const numberOfFiles = this.attachments.length;
        if (numberOfFiles === 0) {
            const attachmentsTotalSize = this.#parent.querySelector('.write-letter__attachments__view-button__counter');
            attachmentsTotalSize.textContent = '';
            const viewButton = this.#parent.querySelector('.write-letter__attachments__view-button');
            const deleteAllButton = this.#parent.querySelector('.write-letter__attachments__delete-all-button');
            viewButton.classList.remove('appear');
            deleteAllButton.classList.remove('appear');
        } else {
            const numberOfFilesLabel = this.#parent.querySelector('.write-letter__attachments__view-button__label');
            if ((numberOfFiles % 10 === 1) && (numberOfFiles % 100 !== 11)) {
                numberOfFilesLabel.textContent = `${numberOfFiles} файл`;
            } else {
                if ((numberOfFiles % 10 === 2 || numberOfFiles % 10 === 3 || numberOfFiles % 10 === 4) && (numberOfFiles % 100 !== 12) && (numberOfFiles % 100 !== 13) && (numberOfFiles % 100 !== 14)) {
                    numberOfFilesLabel.textContent = `${numberOfFiles} файла`;
                } else {
                    numberOfFilesLabel.textContent = `${numberOfFiles} файлов`;
                }
            }


            const attachmentsTotalSize = this.#parent.querySelector('.write-letter__attachments__view-button__counter');
            let fileSize = object.file.size;
            fileSize = fileSize / 1048576;
            const prevTotalSize = attachmentsTotalSize.textContent.substring(0, (attachmentsTotalSize.textContent).length - 3);
            const newTotalSize = (Number(prevTotalSize) - fileSize >= 0) ? (Number(prevTotalSize) - fileSize) : 0;
            attachmentsTotalSize.textContent = String(newTotalSize).substring(0, 4) + ' МБ';
        }

        if (this.#config.values?.changeDraft) {
            this.handleTypingDraftUpdateDebounced();
        } else {
            this.handleTypingDraftDebounced();
        }
    }

    bindAttachmnetsToLetter = async (id) => {
        if (this.#config.files) {
            for (let attachment of this.#config?.files) {
                this.attachments.push(attachment);
            }
        }
        for (let attachment of this.attachments) {
            const attachmentId = attachment.id;
            dispathcher.do(actionBindAttachmnetsToLetter(id, attachmentId));
        }
    }

    handleTypingDraftUpdate = async () => {
        console.log('draftupdate');
        const toInput = document.querySelector('.write-letter__to__input');
        const topicInput = document.querySelector('.write-letter__subject__input');
        const textInput = document.querySelector('.write-letter__text');

        const to = toInput.value.trim();
        let topic = topicInput.value.trim();
        let text = textInput.value.trim();

        if (!topic) {
            topic = "Без темы";
        }

        if (!text) {
            text = "Пустое письмо";
        }

        const newLetter = {
            readStatus: false,
            topic: topic,
            text: text,
            recipientEmail: to,
            senderEmail: this.#config.user.login,
            draftStatus: true,
        };
        if (this.#config.values?.replyId) {
            newLetter.replyToEmailId = this.#config.values.replyId;
        }
        dispathcher.do(actionTypingUpdateDraft(this.#config.values?.id, newLetter));
    };

    handleTypingDraftUpdateDebounced = debounce(this.handleTypingDraftUpdate, 1000);


    handleTypingDraft = async () => {
        console.log('draftCreate');

        const toInput = document.querySelector('.write-letter__to__input');
        const topicInput = document.querySelector('.write-letter__subject__input');
        const textInput = document.querySelector('.write-letter__text');

        const to = toInput.value.trim();
        let topic = topicInput.value.trim();
        let text = textInput.value.trim();

        if (!topic) {
            topic = "Без темы";
        }

        if (!text) {
            text = "Пустое письмо";
        }

        const newLetter = {
            readStatus: false,
            draftStatus: true,
            topic: topic,
            text: text,
            recipientEmail: to,
            senderEmail: this.#config.user.login,
        };
        if (this.#config.values?.replyId) {
            newLetter.replyToEmailId = this.#config.values.replyId;
        }
        dispathcher.do(actionTypingAddDraft(newLetter));
    };

    handleTypingDraftDebounced = debounce(this.handleTypingDraft, 1000);


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
        const fileName = attachment.fileName;
        await this.downloadURI(url, fileName);
    }

    downloadAllAttachments = async (e) => {
        for (let attachment of this.#config.files) {
            this.downloadAttachment(e, attachment.id);
        }
    }


    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {

        this.#parent
            .querySelectorAll('.list-attachment').forEach((file) => {
                file.querySelector('.list-attachment__delete-button').
                    addEventListener('click', (e) => this.downloadAttachment(e, file.dataset.id));
            })
        this.#parent
            ?.querySelector('.from-letter__attachments__download-all-button')
            ?.addEventListener('click', this.downloadAllAttachments);

        this.#parent
            .querySelector('.write-letter__attachments__attach-button')
            .addEventListener('click', this.addAttachmentThrottled);
        this.#parent
            .querySelector('.write-letter__attachments__delete-all-button')
            .addEventListener('click', this.deleteAllAttachments)

        this.#config.menu.component.addListeners();
        this.#config.header.component.addListeners();
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .addEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.header__dropdown__profile-button')
            .addEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('.write-letter__buttons__cancel-button')
            .addEventListener('click', this.handleBack);
        if (this.#config.values?.changeDraft) {
            this.#parent
                .querySelector('.write-letter__buttons__send-button')
                .addEventListener('click', this.handleSendUpdate);
            this.#parent
                .querySelector('.write-letter__buttons__save-draft-button')
                .addEventListener('click', this.handleDraftUpdate);

            this.#parent
                .querySelector('.write-letter__text')
                .addEventListener('input', this.handleTypingDraftUpdateDebounced);

            this.#parent
                .querySelector('.write-letter__to__input')
                .addEventListener('input', this.handleTypingDraftUpdateDebounced);

            this.#parent
                .querySelector('.write-letter__subject__input')
                .addEventListener('input', this.handleTypingDraftUpdateDebounced);
        } else {
            this.#parent
                .querySelector('.write-letter__buttons__send-button')
                .addEventListener('click', this.handleSend);
            this.#parent
                .querySelector('.write-letter__buttons__save-draft-button')
                .addEventListener('click', this.handleDraft);

            this.#parent
                .querySelector('.write-letter__text')
                .addEventListener('input', this.handleTypingDraftDebounced);
            this.#parent
                .querySelector('.write-letter__to__input')
                .addEventListener('input', this.handleTypingDraftDebounced);

            this.#parent
                .querySelector('.write-letter__subject__input')
                .addEventListener('input', this.handleTypingDraftDebounced);
        }

        this.#parent.addEventListener('click', this.handleDropdowns);
        mediator.on('logout', this.handleExitResponse)
        mediator.on('send', this.handleSendResponse)
        mediator.on('addDraft', this.handleSendResponse)
        mediator.on('typingAddDraft', this.handleTypingSendResponse)
        mediator.on('attachFile', this.attachFileResponse);
        mediator.on('deleteAttachment', this.handleDeleteAttachmentResponse);
        mediator.on('bindAttachmentToLetter', this.handleBindAttachmentToLetterResponse);
        mediator.on('typingSend', this.handleTypingSendResponse);



    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {

        this.#parent
            .querySelector('.write-letter__attachments__attach-button')
            .removeEventListener('click', this.addAttachment);
        this.#parent
            .querySelector('.write-letter__attachments__delete-all-button')
            .removeEventListener('click', this.deleteAllAttachments)

        this.#config.menu.component.addListeners();
        this.#config.header.component.addListeners();
        this.#parent
            .querySelector('.header__dropdown__logout-button')
            .removeEventListener('click', this.handleExit);
        this.#parent
            .querySelector('.header__dropdown__profile-button')
            .removeEventListener('click', this.handleProfile);
        this.#parent
            .querySelector('.write-letter__buttons__cancel-button')
            .removeEventListener('click', this.handleBack);
        this.#parent
            .querySelector('.write-letter__buttons__send-button')
            .removeEventListener('click', this.handleSendUpdate);
        this.#parent
            .querySelector('.write-letter__buttons__save-draft-button')
            .removeEventListener('click', this.handleDraftUpdate);

        this.#parent
            .querySelector('.write-letter__text')
            .removeEventListener('input', this.handleTypingDraftUpdateDebounced);

        this.#parent
            .querySelector('.write-letter__to__input')
            .removeEventListener('input', this.handleTypingDraftUpdateDebounced);

        this.#parent
            .querySelector('.write-letter__subject__input')
            .removeEventListener('input', this.handleTypingDraftUpdateDebounced);
        this.#parent
            .querySelector('.write-letter__buttons__send-button')
            .removeEventListener('click', this.handleSend);
        this.#parent
            .querySelector('.write-letter__buttons__save-draft-button')
            .removeEventListener('click', this.handleDraft);

        this.#parent
            .querySelector('.write-letter__text')
            .removeEventListener('input', this.handleTypingDraftDebounced);
        this.#parent
            .querySelector('.write-letter__to__input')
            .removeEventListener('input', this.handleTypingDraftDebounced);

        this.#parent
            .querySelector('.write-letter__subject__input')
            .removeEventListener('input', this.handleTypingDraftDebounced);

        this.#parent.removeEventListener('click', this.handleDropdowns);
        mediator.off('logout', this.handleExitResponse)
        mediator.off('send', this.handleSendResponse)
        mediator.off('addDraft', this.handleSendResponse)
        mediator.off('typingAddDraft', this.handleTypingSendResponse)
        mediator.off('attachFile', this.attachFileResponse);
        mediator.off('deleteAttachment', this.handleDeleteAttachmentResponse);
        mediator.off('bindAttachmentToLetter', this.handleBindAttachmentToLetterResponse);
        mediator.off('typingSend', this.handleTypingSendResponse);



    }

    handleExitResponse = (status) => {
        switch (status) {
            case 200:
                dispathcher.do(actionRedirect('/login', true));
                break;
            default:
        }
    }

    handleSendResponse = ({ responseId, status }) => {
        const error = this.#parent
            .querySelector('.write-letter__buttons__error');
        switch (status) {
            case 200:
                if (this.attachments.length !== 0 || this.#config?.files) {
                    this.bindAttachmnetsToLetter(responseId);
                } else {
                    dispathcher.do(actionRedirect('/main', true));
                }
                break;
            default:
                error.textContent = 'Проблема на нашей стороне. Уже исправляем';
                error.classList.add('show');
        }
    }

    attachFileResponse = ({ status, id }) => {
        document
            .querySelector('.write-letter__attachments__attach-button')
            .addEventListener('click', this.addAttachmentThrottled);
        this.addAttachmentIsRunning = false

        document.querySelector('.write-letter__attachments__attach-button').textContent = 'Прикрепить файл';
        const error = this.#parent
            .querySelector('.write-letter__attachments__error');
        switch (status) {
            case 200:
                this.renderAttachment(id);
                break;
            default:
                error.textContent = 'Ошибка загрузки файла';
                error.classList.add('show');
        }
    }

    handleDeleteAttachmentResponse = ({ status, id }) => {
        const error = this.#parent
            .querySelector('.write-letter__attachments__error');
        switch (status) {
            case 200:
                this.renderDeleteAttachment(id);
                break;
            default:
                error.textContent = 'Ошибка удаления файла';
                error.classList.add('show');
        }
    }

    handleBindAttachmentToLetterResponse = (status) => {
        const error = this.#parent
            .querySelector('.write-letter__buttons__error');
        switch (status) {
            case 200:
                if (this.#sendStatus === true) {
                    dispathcher.do(actionRedirect('/main', true));
                    this.#sendStatus = undefined;
                }
                break;
            default:
                error.textContent = 'Проблема на нашей стороне. Уже исправляем';
                error.classList.add('show');
        }
    }

    handleTypingSendResponse = ({ data, status }) => {
        const error = this.#parent
            .querySelector('.write-letter__buttons__error');
        const id = data.body.email.id;
        switch (status) {
            case 200:
                if (this.#config.values === undefined || this.#config.values?.changeDraft === undefined) {
                    console.log('need to edit listeners');
                    this.#config.values = {
                        changeDraft: true,
                        topic: data.body.email.topic,
                        sender: data.body.email.senderEmail,
                        date: data.body.email.dateOfDispatch,
                        text: data.body.email.text,
                        id: id,
                    };
                    WriteLetterView.updateListeners();
                }
                if (this.#config.values?.id) {
                    this.#config.values.id = id;
                }
                if (this.attachments.length !== 0) {
                    this.bindAttachmnetsToLetter(id);
                }

                break;
            default:
                error.textContent = 'Проблема на нашей стороне. Уже исправляем';
                error.classList.add('show');
        }
    }
}
