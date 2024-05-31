import Menu from '../../components/menu/menu.js';
import Header from '../../components/header/header.js';
import dispathcher from '../../modules/dispathcher.js';
import { actionLogout, actionBindAttachmnetsToLetter, actionRedirect, actionSend, actionAttachFile, actionDeleteAttachment, actionSendToForeignDomain } from '../../actions/userActions.js';
import { actionAddDraft, actionSendDraft, actionUpdateDraft } from '../../actions/draftActions.js';

import mediator from '../../modules/mediator.js';
import template from './write-letter.hbs'
import router from '../../modules/router.js';
import WriteLetterView from '../../views/write-letter.js'
import debounce from '../../modules/debounce.js';
import List_attachments from '../../components/list-attachments/list-attachments.js'
import throttle from '../../modules/throttle.js'
import userStore from '../../stores/userStore.js'


const MAX_INPUT_LENGTH = 64;


/**
 * Класс обертки страницы
 * @class
 */
export default class Write__Letter {
    #parent;
    #config;
    #filesNumber;

    /**
     * Конструктор класса
     * @constructor
     * @param {Element} parent
     * @param {object} config
     */
    constructor(parent, config) {
        this.#config = config;
        this.#parent = parent;
        this.#filesNumber = 0;
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
            replyAndNotChangeDraft: this.#config.values?.replySender && (this.#config.values?.changeDraft === undefined),
            resendAndNotChangeDraft: this.#config.values?.resend && (this.#config.values?.changeDraft === undefined)
        };

        // if (this.#config.files) {
        //     elements.list_attachments = new List_attachments(null, this.#config.files).render(),
        //         elements.files_number = this.#calculateFilesNumber(this.#config.files.length),
        //         elements.total_size = this.#calculateTotalSize(this.#config.files)
        // }
        if (this.#config.values?.text && !this.#config.values?.changeDraft) {
            elements.text = this.registerHelper(this.#config.values?.text);
        }
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
        if (this.#config.files) {

            for (let file of this.#config.files) {
                this.currentFile = file;
                file.size = file.fileSize;
                file.name = file.fileName;
                this.renderAttachment(file.id);
            }
            this.#config.files = [];
        }
    }

    /**
     * Функция авторизации
     */

    handleSaveForm = async (e) => {
        e.preventDefault();

    }


    handleDraft = async (e) => {
        e.preventDefault();
        document.querySelector('.write-letter__buttons__save-draft-button')
            .removeEventListener('click', this.handleDraft);
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
            readStatus: true,
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
    };




    handleSend = async (e) => {
        e.preventDefault();
        document.querySelector('.write-letter__buttons__send-button')
            .removeEventListener('click', this.handleSend);
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
    };


    handleDraftUpdate = async (e) => {
        e.preventDefault();
        document
            .querySelector('.write-letter__buttons__save-draft-button')
            .removeEventListener('click', this.handleDraftUpdate);
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
            readStatus: true,
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
    };



    handleSendUpdate = async (e) => {
        e.preventDefault();
        document
            .querySelector('.write-letter__buttons__send-button')
            .removeEventListener('click', this.handleSendUpdate);
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
            router.historyNum -= 1;
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
        oldError.textContent = 'Ошибка';
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
            // if (file.size > 20 * 1024 * 1024) {
            //     error.textContent = 'Файл превышает максимальный размер 20 МБ';
            //     error.classList.add('show');
            //     this.addAttachmentIsRunning = false
            //     document
            //         .querySelector('.write-letter__attachments__attach-button')
            //         .addEventListener('click', this.addAttachmentThrottled);
            //     this.addAttachmentIsRunning = false
            //     return;
            // }


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

        const viewButton = document.querySelector('.write-letter__attachments__view-button');
        const deleteAllButton = document.querySelector('.write-letter__attachments__delete-all-button');

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
    }

    bindAttachmnetsToLetter = async (id) => {
        for (let attachment of this.attachments) {
            const attachmentId = attachment.id;
            dispathcher.do(actionBindAttachmnetsToLetter(id, attachmentId));
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
        const fileName = attachment.fileName;
        await this.downloadURI(url, fileName);
    }

    downloadAllAttachments = async (e) => {
        for (let attachment of this.#config.files) {
            this.downloadAttachment(e, attachment.id);
        }
    }

    handleToError = (e) => {
        e.preventDefault();
        const toInput = document.querySelector('.write-letter__to__input');
        console.log(toInput);
        let oldError = this.#parent
            .querySelector('.write-letter__to__error');
        oldError.classList.remove('appear');
        oldError = toInput;
        oldError.classList.remove('input-background-error');
    }

    /**
     * Добавляет листенеры на компоненты
     */
    addListeners() {

        this.#parent.
            querySelector('.write-letter__to__input')
            .addEventListener('click', this.handleToError);


        this.#parent
            .querySelector('.write-letter__attachments__attach-button')
            .addEventListener('click', this.addAttachmentThrottled);
        this.#parent
            .querySelector('.write-letter__attachments__delete-all-button')
            .addEventListener('click', this.deleteAllAttachments)

        this.#config.menu.component.addListeners();
        this.#config.header.component.addListeners();
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
        } else {
            this.#parent
                .querySelector('.write-letter__buttons__send-button')
                .addEventListener('click', this.handleSend);
            this.#parent
                .querySelector('.write-letter__buttons__save-draft-button')
                .addEventListener('click', this.handleDraft);
        }

        this.#parent.addEventListener('click', this.handleDropdowns);
        mediator.on('send', this.handleSendResponse)
        mediator.on('addDraft', this.handleSendResponse)
        mediator.on('attachFile', this.attachFileResponse);
        mediator.on('deleteAttachment', this.handleDeleteAttachmentResponse);
        mediator.on('bindAttachmentToLetter', this.handleBindAttachmentToLetterResponse);
        mediator.on('sendToForeignDomain', this.handleSendToForeignDomain);

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
            .querySelector('.write-letter__buttons__cancel-button')
            .removeEventListener('click', this.handleBack);
        this.#parent
            .querySelector('.write-letter__buttons__send-button')
            .removeEventListener('click', this.handleSendUpdate);
        this.#parent
            .querySelector('.write-letter__buttons__save-draft-button')
            .removeEventListener('click', this.handleDraftUpdate);
        this.#parent
            .querySelector('.write-letter__buttons__send-button')
            .removeEventListener('click', this.handleSend);
        this.#parent
            .querySelector('.write-letter__buttons__save-draft-button')
            .removeEventListener('click', this.handleDraft);

        this.#parent.removeEventListener('click', this.handleDropdowns);
        mediator.off('send', this.handleSendResponse)
        mediator.off('addDraft', this.handleSendResponse)
        mediator.off('attachFile', this.attachFileResponse);
        mediator.off('deleteAttachment', this.handleDeleteAttachmentResponse);
        mediator.off('bindAttachmentToLetter', this.handleBindAttachmentToLetterResponse);
        mediator.off('sendToForeignDomain', this.handleSendToForeignDomain);



    }

    handleSendResponse = ({ id, status }) => {
        const error = this.#parent
            .querySelector('.write-letter__buttons__error');
        switch (status) {
            case 200:
                if (this.attachments.length) {
                    this.bindAttachmnetsToLetter(id);
                } else {
                    const toInput = document.querySelector('.write-letter__to__input');
                    const to = toInput.value.trim();
                    if (to.indexOf('@mailhub.su') === -1) {
                        dispathcher.do(actionSendToForeignDomain(id));
                    } else {
                        dispathcher.do(actionRedirect('/main', true));
                    }
                }

                break;
            default:
                error.textContent = 'Проблема на нашей стороне. Уже исправляем';
                error.classList.add('show');
                if (this.#config.values?.changeDraft) {
                    this.#parent
                        .querySelector('.write-letter__buttons__send-button')
                        .addEventListener('click', this.handleSendUpdate);
                    this.#parent
                        .querySelector('.write-letter__buttons__save-draft-button')
                        .addEventListener('click', this.handleDraftUpdate);
                } else {
                    this.#parent
                        .querySelector('.write-letter__buttons__send-button')
                        .addEventListener('click', this.handleSend);
                    this.#parent
                        .querySelector('.write-letter__buttons__save-draft-button')
                        .addEventListener('click', this.handleDraft);
                }
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
                this.#filesNumber++;
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
                this.#filesNumber--;
                break;
            default:
                error.textContent = 'Ошибка удаления файла';
                error.classList.add('show');
        }
    }

    handleBindAttachmentToLetterResponse = ({ status, id }) => {
        const error = this.#parent
            .querySelector('.write-letter__buttons__error');
        switch (status) {
            case 200:
                this.#filesNumber--;
                if (this.#filesNumber === 0) {
                    const toInput = document.querySelector('.write-letter__to__input');
                    const to = toInput.value.trim();
                    if (to.indexOf('@mailhub.su') === -1) {
                        dispathcher.do(actionSendToForeignDomain(id));
                    } else {
                        dispathcher.do(actionRedirect('/main', true));
                    }
                }
                break;
            default:
                error.textContent = 'Проблема на нашей стороне. Уже исправляем';
                error.classList.add('show');
                if (this.#config.values?.changeDraft) {
                    this.#parent
                        .querySelector('.write-letter__buttons__send-button')
                        .addEventListener('click', this.handleSendUpdate);
                    this.#parent
                        .querySelector('.write-letter__buttons__save-draft-button')
                        .addEventListener('click', this.handleDraftUpdate);
                } else {
                    this.#parent
                        .querySelector('.write-letter__buttons__send-button')
                        .addEventListener('click', this.handleSend);
                    this.#parent
                        .querySelector('.write-letter__buttons__save-draft-button')
                        .addEventListener('click', this.handleDraft);
                }
        }
    }

    handleSendToForeignDomain = (status) => {
        const error = this.#parent
            .querySelector('.write-letter__buttons__error');
        switch (status) {
            case 200:
                dispathcher.do(actionRedirect('/main', true));
                break;
            default:
                error.textContent = 'Проблема на нашей стороне. Уже исправляем';
                error.classList.add('show');
                if (this.#config.values?.changeDraft) {
                    this.#parent
                        .querySelector('.write-letter__buttons__send-button')
                        .addEventListener('click', this.handleSendUpdate);
                    this.#parent
                        .querySelector('.write-letter__buttons__save-draft-button')
                        .addEventListener('click', this.handleDraftUpdate);
                } else {
                    this.#parent
                        .querySelector('.write-letter__buttons__send-button')
                        .addEventListener('click', this.handleSend);
                    this.#parent
                        .querySelector('.write-letter__buttons__save-draft-button')
                        .addEventListener('click', this.handleDraft);
                }
        }
    }
}
