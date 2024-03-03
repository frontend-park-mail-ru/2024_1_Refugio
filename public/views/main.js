import Main from '../pages/main/main.js'
import BaseView from './base.js'

const config = {
    header: {
        logo: 'Logo',
        search: 'Поиск',
        menu: {

        },
    },
    menu: {},
    content: {
        list_letters: [
            {
                img: 'static/img/1200px-User_icon-cp.svg.png',
                title: 'Письмо',
                text: 'Some text about fish',
            },
            {
                img: 'static/img/1200px-User_icon-cp.svg.png',
                title: 'Письмо',
                text: 'Some text about fish',
            },
            {
                img: 'static/img/1200px-User_icon-cp.svg.png',
                title: 'Письмо',
                text: 'Some text about fish',
            },
        ],
    },
};

export default class MainView extends BaseView {
    renderPage() {
        const page = new Main(this.root, config);
        this.components.push(page);
        this.render();
    }

}
