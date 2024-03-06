import List_letter from '../../components/list-letter/list-letter.js';

export default class Main {
    #parent
    #config

    constructor(parent, config) {
        this.#config = config;
        this.#parent = parent;
    }

    #renderConfig(letters) {
        const result = [];
        letters.forEach((letter) => {
            result.push(new List_letter(null, {
                img: letter.photoId,
                title: letter.topic,
                text: letter.text,
            }).render(),)
        });
        return result
    }

    render() {
        const template = Handlebars.templates['list-letters.hbs'];
        const list_letters = this.#renderConfig(this.#config?.list_letters ? this.#config.list_letters : []);
        return template({ list_letters })
    }
}