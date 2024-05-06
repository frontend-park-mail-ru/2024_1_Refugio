import template from './menu.hbs'
import dispathcher from '../../modules/dispathcher.js';
import { actionCreateFolder, actionRedirect, actionRedirectToLetter } from '../../actions/userActions.js';
import Folder from '../folder/folder.js';
import mediator from '../../modules/mediator.js';
/**
 * Класс обертки компонента
 * @class
 */
export default class Menu {
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
     * рендерит компонент в DOM
     */
    render() {
        this.#config.result = [];
        this.#config.folders.forEach((folder) => {
            this.#config.result.unshift(new Folder(this.#parent, {
                name: folder.name,
                id: folder.id,
            }));
        });
        const renderResult = [];
        this.#config.result.forEach((folder) => {
            renderResult.unshift(folder.render());
        })
        const elements = {
            incoming_count: this.#config.incoming_count,
            titleIncoming: (document.title === 'Входящие' ? document.title : undefined),
            titleSent: (document.title === 'Отправленные' ? document.title : undefined),
            folders: renderResult,
        };
        return template(elements);
    }

    handleSent = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/sent', true));
    };

    handleSpam = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/spam', true));
    };

    handleDrafts = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/drafts', true));
    };

    handleWriteLetter = (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/write_letter', true));
    };

    handleMain = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/main', true));
    };

    handleNewFolder = (e) => {
        e.preventDefault();
        mediator.emit('folderDropdown');
        this.#parent.querySelector('.menu__new-folder-button').style.display = 'none';
        this.#parent.querySelector('#new-wrapper').style.display = 'block';
    }

    handleNewFolderCancel = (e) => {
        e.preventDefault();
        mediator.emit('folderDropdown');
    }

    handleCreateFolder = async (e) => {
        e.preventDefault();
        const nameInput = this.#parent.querySelector('#new-folder-input');
        const nameError = this.#parent.querySelector('#new-folder-error');
        const name = nameInput.value.trim();
        nameError.style.display = 'none';
        if (!name) {
            nameError.textContent = 'Введите имя';
            nameError.style.display = 'block';
            nameInput.classList.add('input-background-error');
            return;
        }
        const folder = {
            name: name,
        }
        await dispathcher.do(actionCreateFolder(folder));
    }

    handleFolderDropdown = () => {
        this.#parent.querySelectorAll('.menu__custom-folder__dropdown__wrapper').forEach((element) => {
            element.style.display = 'none';
        });
        this.#parent.querySelector('.menu__new-folder-button').style.display = 'grid';
        this.#parent.querySelectorAll('.menu__custom-folder__options').forEach((element) => {
            element.style.display = 'grid';
        });
        this.#parent.querySelectorAll('.menu__folder__text').forEach((element) => {
            element.style.display = 'grid';
        });
    }

    addListeners() {
        this.#config.result.forEach((folder) => {
            folder.addListeners();
        });
        this.#parent
            .querySelector('#sent-folder')
            .addEventListener('click', this.handleSent);
        this.#parent
            .querySelector('#drafts-folder')
            .addEventListener('click', this.handleDrafts);
        this.#parent
            .querySelector('#spam-folder')
            .addEventListener('click', this.handleSpam);
        this.#parent
            .querySelector('.menu__write-letter-button')
            .addEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('#incoming-folder')
            .addEventListener('click', this.handleMain);
        this.#parent
            .querySelector('.menu__new-folder-button')
            .addEventListener('click', this.handleNewFolder);
        this.#parent
            .querySelector('#new-folder-cancel')
            .addEventListener('click', this.handleNewFolderCancel);
        this.#parent
            .querySelector('#new-folder-save')
            .addEventListener('click', this.handleCreateFolder);
        mediator.on('folderDropdown', this.handleFolderDropdown);
        mediator.on('createFolder', this.handleFolderCreateResponse);
        mediator.on('updateFolder', this.handleFolderUpdateResponse);
        mediator.on('deleteFolder', this.handleFolderDeleteResponse);
    }

    removeListeners() {
        this.#config.result.forEach((folder) => {
            folder.removeListeners();
        })
        this.#parent
            .querySelector('#sent-folder')
            .removeEventListener('click', this.handleSent);
        this.#parent
            .querySelector('#drafts-folder')
            .removeEventListener('click', this.handleDrafts);
        this.#parent
            .querySelector('.menu__write-letter-button')
            .removeEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('#incoming-folder')
            .removeEventListener('click', this.handleMain);
        this.#parent
            .querySelector('.menu__new-folder-button')
            .removeEventListener('click', this.handleNewFolder);
        this.#parent
            .querySelector('#new-folder-cancel')
            .removeEventListener('click', this.handleNewFolderCancel);
        this.#parent
            .querySelector('#new-folder-save')
            .removeEventListener('click', this.handleCreateFolder);
        mediator.off('folderDropdown', this.handleFolderDropdown);
        mediator.off('createFolder', this.handleFolderCreateResponse);
        mediator.off('updateFolder', this.handleFolderUpdateResponse);
        mediator.off('deleteFolder', this.handleFolderDeleteResponse);
    }

    handleFolderCreateResponse = (status) => {
        let errorSign = this.#parent
            .querySelector('#new-folder-error');
        errorSign.style.display = 'none';
        switch (status) {
            case 200:
                if (!window.location.search) {
                    dispathcher.do(actionRedirect(window.location.pathname + window.location.search, false));
                } else if (window.location.pathname === '/folder') {
                    dispathcher.do(actionRedirectToLetter(window.location.search.slice(4), false, true));
                } else {
                    dispathcher.do(actionRedirectToLetter(window.location.search.slice(4), false));
                }
                break;
            default:
                errorSign.textContent = 'Проблема на нашей стороне, уже исправляем';
                errorSign.style.display = 'block';
                break;
        }
    }

    handleFolderUpdateResponse = ({ status, id }) => {
        let errorSign = this.#parent
            .querySelector(`#f-error-${id}`);
        errorSign.style.display = 'none';
        switch (status) {
            case 200:
                if (!window.location.search) {
                    dispathcher.do(actionRedirect(window.location.pathname + window.location.search, false));
                } else {
                    if (window.location.pathname === '/letter') {
                        dispathcher.do(actionRedirectToLetter(window.location.search.slice(4), false));
                    } else if (window.location.pathname === '/folder') {
                        dispathcher.do(actionRedirectToLetter(window.location.search.slice(4), false, true));
                    }
                }
                break;
            default:
                errorSign.textContent = 'Проблема на нашей стороне, уже исправляем';
                errorSign.style.display = 'block';
                break;
        }
    }

    handleFolderDeleteResponse = ({ status, id }) => {
        let errorSign = this.#parent
            .querySelector(`#f-error-${id}`);
        errorSign.style.display = 'none';
        switch (status) {
            case 200:
                if (!window.location.search) {
                    dispathcher.do(actionRedirect(window.location.pathname + window.location.search, false));
                } else {
                    if (window.location.pathname === '/letter') {
                        dispathcher.do(actionRedirectToLetter(window.location.search.slice(4), false));
                    } else if (window.location.pathname === '/folder') {
                        if (window.location.search.slice(4) === String(id)) {
                            dispathcher.do(actionRedirect('/main', false));
                        } else {
                            dispathcher.do(actionRedirectToLetter(window.location.search.slice(4), false, true));
                        }
                    }
                }
                break;
            default:
                errorSign.textContent = 'Проблема на нашей стороне, уже исправляем';
                errorSign.style.display = 'block';
                break;
        }
    }
}