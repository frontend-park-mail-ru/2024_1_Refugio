import Header from '../../components/header/header.js';
import Menu from '../../components/menu/menu.js';
import template from './404.hbs'

/**
 * Класс обертки страницы
 * @class
 */
export default class Page404 {
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
        this.#config.menu.component = new Menu(this.#parent, this.#config.menu);
        this.#config.header.component = new Header(this.#parent, this.#config.header);
        const elements = {
            header: this.#config.header.component.render(),
            menu: this.#config.menu.component.render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

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
     * Добавляет листенеры на компоненты
     */
    addListeners() {
        this.#config.menu.component.addListeners();
        this.#config.header.component.addListeners();
        this.#parent.addEventListener('click', this.handleDropdowns);
    }

    /**
     * Удаляет листенеры
     */
    removeListeners() {
        this.#config.menu.component.removeListeners();
        this.#config.header.component.removeListeners();
        this.#parent.removeEventListener('click', this.handleDropdowns);
    }
}
