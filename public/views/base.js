/**
 * Класс для рендера абстрактной страницы
 * @class
 */
export default class BaseView {
    components = [];
    root;

    /**
     * Конструктор класса
     * @constructor
     */
    constructor() {
        this.root = document.querySelector('#root');
    }

    /**
     * Функция рендера каждого элемента страницы
     */
    render() {
        this.components.forEach((component) => component.render());
    }

    /**
     * Функция добавления необходимых листенеров всем элементам страницы
     */
    addListeners() {
        this.components.forEach((component) => component.addListeners());
    }

    /**
     * Функция удаления листенеров
     */
    removeListeners() {
        this.components.forEach((component) => component.removeListeners());
    }

    /**
     * Функция очищения страницы
     */
    clear() {
        this.removeListeners();
        this.root.innerHTML = '';
        this.components = [];
    }
}