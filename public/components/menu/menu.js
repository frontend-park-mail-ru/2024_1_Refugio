import template from './menu.hbs'
import dispathcher from '../../modules/dispathcher.js';
import { actionRedirect } from '../../actions/userActions.js';
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
        const elements = {
            incoming_count: this.#config.incoming_count,
            titleIncoming: (document.title === 'Входящие' ? document.title : undefined),
            titleSent: (document.title === 'Отправленные' ? document.title : undefined),
        };
        return template(elements);
    }

    handleSent = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/sent', true));
    };

    handleWriteLetter = (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/write_letter', true));
    };

    handleMain = async (e) => {
        e.preventDefault();
        dispathcher.do(actionRedirect('/main', true));
    };

    addListeners() {
        this.#parent
            .querySelector('#sent-folder')
            .addEventListener('click', this.handleSent);
        this.#parent
            .querySelector('.menu__write-letter-button')
            .addEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('#incoming-folder')
            .addEventListener('click', this.handleMain);
    }

    removeListeners() {
        this.#parent
            .querySelector('#sent-folder')
            .removeEventListener('click', this.handleSent);
        this.#parent
            .querySelector('.menu__write-letter-button')
            .removeEventListener('click', this.handleWriteLetter);
        this.#parent
            .querySelector('#incoming-folder')
            .removeEventListener('click', this.handleMain);
    }
}