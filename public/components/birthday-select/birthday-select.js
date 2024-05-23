import template from './birthday-select.hbs'

/**
 * Класс обертки компонента
 * @class
 */
export default class Birthday_Select {
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
        let elements;
        if (this.#config?.vkUser?.birthday) {
            if (this.#config.vkUser.birthday === '0001-01-01T00:00:00Z') {
                this.#config.vkUser.birthday = '2000-01-01T00:00:00Z';
            }
            elements = {
                birthday_day: ((this.#config?.vkUser?.birthday.substr(8, 1) === '0') ? this.#config?.vkUser?.birthday.substr(9, 1) : this.#config?.vkUser?.birthday.substr(8, 2)) || 1,
                birthday_month: this.parseMonths(Number(this.#config?.vkUser?.birthday.substr(5, 2) || 1)),
                birthday_year: this.#config?.vkUser?.birthday.substr(0, 4) || 2024,
            }
        } else {
            elements = {
                birthday_day: ((this.#config?.user?.birthday.substr(8, 1) === '0') ? this.#config?.user?.birthday.substr(9, 1) : this.#config?.user?.birthday.substr(8, 2)) || 1,
                birthday_month: this.parseMonths(Number(this.#config?.user?.birthday.substr(5, 2) || 1)),
                birthday_year: this.#config?.user?.birthday.substr(0, 4) || 2024,
            }
        }
        return template(elements);
    }

    parseMonths(number) {
        switch (number) {
            case (1):
                return 'Январь';
            case (2):
                return 'Февраль';
            case (3):
                return 'Март';
            case (4):
                return 'Апрель';
            case (5):
                return 'Май';
            case (6):
                return 'Июнь';
            case (7):
                return 'Июль';
            case (8):
                return 'Август';
            case (9):
                return 'Сентябрь';
            case (10):
                return 'Октябрь';
            case (11):
                return 'Ноябрь';
            case (12):
                return 'Декабрь';
        }
    }
}