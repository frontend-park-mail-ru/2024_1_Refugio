import mediator from '../../modules/mediator.js';
import template from './folder.hbs'
import dispathcher from '../../modules/dispathcher.js';
import { actionUpdateFolder, actionDeleteFolder, actionRedirectToLetter } from '../../actions/userActions.js';
/**
 * Класс обертки компонента
 * @class
 */
export default class Folder {
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
        const folder = {
            name: this.#config.name,
            id: this.#config.id,
            curFolder: Number(this.#config.currentFolder) === Number(this.#config.id),
            folderFlag: this.#config.folderFlag,
        };
        return template(folder);
    }

    handleOptions = (e) => {
        e.preventDefault();
        e.stopPropagation();
        mediator.emit('folderDropdown');
        this.#parent.querySelector(`#f-name-${this.#config.id}`).style.display = 'none';
        this.#parent.querySelector(`#f-options-${this.#config.id}`).style.display = 'none';
        this.#parent.querySelector(`#f-wrapper-${this.#config.id}`).style.display = 'block';
    }

    handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const nameInput = this.#parent.querySelector(`#f-input-${this.#config.id}`);
        const nameError = this.#parent.querySelector(`#f-error-${this.#config.id}`);
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
        await dispathcher.do(actionUpdateFolder(this.#config.id, folder));
    }

    handleCancel = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.#parent.querySelector(`#f-name-${this.#config.id}`).style.display = 'block';
        this.#parent.querySelector(`#f-options-${this.#config.id}`).style.display = 'block';
        this.#parent.querySelector(`#f-wrapper-${this.#config.id}`).style.display = 'none';
    }

    handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await dispathcher.do(actionDeleteFolder(this.#config.id));
    }

    handleFolder = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirectToLetter(this.#config.id, true, true));
    }

    handleWrapper = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    addListeners() {
        this.#parent.querySelector(`#f-options-${this.#config.id}`).addEventListener('click', this.handleOptions);
        this.#parent.querySelector(`#f-cancel-${this.#config.id}`).addEventListener('click', this.handleCancel);
        this.#parent.querySelector(`#f-save-${this.#config.id}`).addEventListener('click', this.handleSave);
        this.#parent.querySelector(`#f-delete-${this.#config.id}`).addEventListener('click', this.handleDelete);
        this.#parent.querySelector(`#f-folder-${this.#config.id}`).addEventListener('click', this.handleFolder);
        this.#parent.querySelector(`#f-wrapper-${this.#config.id}`).addEventListener('click', this.handleWrapper);
        mediator.on('updateFolder', this.handleFolderUpdateResponse);
        mediator.on('deleteFolder', this.handleFolderDeleteResponse);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#parent.querySelector(`#f-options-${this.#config.id}`).removeEventListener('click', this.handleOptions);
        this.#parent.querySelector(`#f-cancel-${this.#config.id}`).removeEventListener('click', this.handleCancel);
        this.#parent.querySelector(`#f-save-${this.#config.id}`).removeEventListener('click', this.handleSave);
        this.#parent.querySelector(`#f-delete-${this.#config.id}`).removeEventListener('click', this.handleDelete);
        this.#parent.querySelector(`#f-folder-${this.#config.id}`).removeEventListener('click', this.handleFolder);
        this.#parent.querySelector(`#f-wrapper-${this.#config.id}`).removeEventListener('click', this.handleWrapper);
        mediator.off('updateFolder', this.handleFolderUpdateResponse);
        mediator.off('deleteFolder', this.handleFolderDeleteResponse);
    }

    cmpId = (id) => {
        return Number(id) === Number(this.#config.id);
    }

    handleFolderDeleteResponse = ({ status, id }) => {
        let errorSign = this.#parent
            .querySelector(`#f-error-${id}`);
        errorSign.style.display = 'none';
        switch (status) {
            case 200:
                if (Number(this.#config.id) === Number(id)) {
                    const node = this.#parent.querySelector(`#f-folder-${id}`);
                    this.removeListeners();
                    node.parentNode.removeChild(node);
                    mediator.emit("deletingFolder", id);             
                }
                break;
            default:
                errorSign.textContent = 'Проблема на нашей стороне, уже исправляем';
                errorSign.style.display = 'block';
                break;
        }
    }

    handleFolderUpdateResponse = ({ status, id, name }) => {
        let errorSign = this.#parent
            .querySelector(`#f-error-${id}`);
        errorSign.style.display = 'none';
        switch (status) {
            case 200:
                if (Number(this.#config.id) === Number(id)) {
                    const node = this.#parent.querySelector(`#f-name-${id}`);
                    node.textContent = name;
                    this.#parent.querySelector(`#f-name-${this.#config.id}`).style.display = 'block';
                    this.#parent.querySelector(`#f-options-${this.#config.id}`).style.display = 'block';
                    this.#parent.querySelector(`#f-wrapper-${this.#config.id}`).style.display = 'none';
                }
                break;
            default:
                errorSign.textContent = 'Проблема на нашей стороне, уже исправляем';
                errorSign.style.display = 'block';
                break;
        }
    }
}