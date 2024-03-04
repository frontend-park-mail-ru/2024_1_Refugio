import Main from '../pages/main/main.js'
import BaseView from './base.js'
import ajax from '../modules/ajax.js'

const config = {
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

export default class MainView extends BaseView {
    renderPage() {
        this.clear();
        this.#getUserInfo();
        this.#getEmailsInfo();
        const page = new Main(this.root, config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }

    #getUserInfo() {
        (async () => {
            const response = await ajax(
                'GET', 'http://89.208.223.140:8080/api/v1/get-user', null, 'application/json'
            );
            const status = response.status;
            const data = await response.json();
            config.header.logo = data.body.user.name;
        })()
    }

    #getEmailsInfo() {
        (async () => {
            const response = await ajax(
                'GET', 'http://89.208.223.140:8080/api/v1/emails', null, 'application/json'
            );
            const status = response.status;
            const data = await response.json();
            config.content.list_letters = data.body.emails;
        })()
    }
}
