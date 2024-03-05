import Main from '../pages/main/main.js'
import BaseView from './base.js'
import ajax from '../modules/ajax.js'

export default class MainView extends BaseView {
    #config = {
        header: {
            logo: 'Mail',
            search: 'Поиск',
            username: 'Профиль',
        },
        menu: {},
        content: {
            list_letters: [
                {
                    photoId: 'static/img/1200px-User_icon-cp.svg.png',
                    topic: 'Письмо',
                    text: 'Some text about fish',
                },
                {
                    photoId: 'static/img/1200px-User_icon-cp.svg.png',
                    topic: 'Письмо',
                    text: 'Some text about fish',
                },
                {
                    photoId: 'static/img/1200px-User_icon-cp.svg.png',
                    topic: 'Письмо',
                    text: 'Some text about fish',
                },
            ],
        },
    };

    async renderPage() {
        this.clear();
        this.#config.header.username = await this.#getUserInfo();
        this.#config.content.list_letters = await this.#getEmailsInfo();
        const page = new Main(this.root, this.#config);
        console.log(this.#config);
        console.log(this.#config.header);
        this.components.push(page);
        this.render();
        this.addListeners();
    }

    async #getUserInfo() {
        const response = await ajax(
            'GET', 'http://89.208.223.140:8080/api/v1/get-user', null, 'application/json'
        );
        const status = response.status;
        const data = await response.json();
        return data.body.user.name;
    }

    async #getEmailsInfo() {
        const response = await ajax(
            'GET', 'http://89.208.223.140:8080/api/v1/emails', null, 'application/json'
        );
        const status = response.status;
        const data = await response.json();
        return data.body.emails;
    }
}
