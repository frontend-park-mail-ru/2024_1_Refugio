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
        const titleIncoming = (document.title === 'Входящие' ? document.title : undefined);
        const titleSent = (document.title === 'Отправленные' ? document.title : undefined);
        const titleSpam = (document.title === 'Спам' ? document.title : undefined);
        const titleDrafts = (document.title === 'Черновики' ? document.title : undefined);
        let folderFlag = false;
        if (!titleIncoming && !titleSent && !titleSpam && !titleDrafts) {
            folderFlag = true;
        }
        this.#config.result = [];
        this.#config.folders.forEach((folder) => {
            this.#config.result.unshift(new Folder(this.#parent, {
                name: folder.name,
                id: folder.id,
                currentFolder: this.#config.currentFolder,
                folderFlag: folderFlag,
            }));
        });
        const renderResult = [];
        this.#config.result.forEach((folder) => {
            renderResult.unshift(folder.render());
        })
        const elements = {
            folderFlag: false,
            incoming_count: this.#config.incoming_count,
            titleIncoming: titleIncoming,
            titleSent: titleSent,
            titleSpam: titleSpam,
            titleDrafts: titleDrafts,
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

        if (name.length > 32) {
            nameError.textContent = 'Слишком длинное название';
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
    }

    handleFolderCreateResponse = ({ status, folders }) => {
        let errorSign = this.#parent
            .querySelector('#new-folder-error');
        errorSign.style.display = 'none';
        switch (status) {
            case 200:
                const smth = this.#parent.querySelector('.menu__new-folder-button')
                this.#config.folders.forEach((oldFolder) => {
                    folders = folders.filter((folder) => Number(folder.id) !== Number(oldFolder.id));
                });
                const newFolder = new Folder(this.#parent, {
                    name: folders[0].name,
                    id: folders[0].id,
                });
                this.#config.result.push(newFolder);
                smth.insertAdjacentHTML('beforebegin', newFolder.render());
                newFolder.addListeners();
                this.handleFolderDropdown();
                break;
            default:
                errorSign.textContent = 'Проблема на нашей стороне, уже исправляем';
                errorSign.style.display = 'block';
                break;
        }
    }
}