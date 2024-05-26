import List_attachment from '../../components/list-attachment/list-attachment.js'
import template from './list-attachments.hbs'

/**
 * Класс обертки компонента
 * @class
 */
export default class List_attachments {
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
     * Функция, создающая массив компонетов для рендера
     * @param {Array<object>} files письменное описание писем
     * @returns {Array} массив объектов класса писем
     */
    #renderConfig(files) {
        const result = [];
        files.forEach((file) => {
            result.push(new List_attachment(null, {
                id: file.id,
                name: file.fileName,
                size: String(file.fileSize / 1048576).substring(0, 3),
            }).render(),);
        });
        return result;
    }

    /**
     * рендерит компонент в DOM
     */
    render() {

        const list_attachments = this.#renderConfig(this.#config);
        return template({ list_attachments });
    }
}