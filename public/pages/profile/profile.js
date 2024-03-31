import ajax from '../../modules/ajax.js';


/**
 * Класс обертки страницы
 * @class
 */
export default class Profile {
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
        const template = Handlebars.templates['profile.hbs'];
        const elements = {
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    /**
     * Функция авторизации
     */
   
    addListeners() {

    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {

    }
}
