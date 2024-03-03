import Login from '../pages/login/login.js'
import BaseView from './base.js'

const config = {
    // header: {
    //     logo: 'Logo',
    //     search: 'Поиск',
    //     menu: {
    //
    //     },
    // },
    // menu: {},
    // content: {
    //     list_letters: [
    //         {
    //             img: 'static/img/1200px-User_icon-cp.svg.png',
    //             title: 'Письмо',
    //             text: 'Some text about fish',
    //         },
    //         {
    //             img: 'static/img/1200px-User_icon-cp.svg.png',
    //             title: 'Письмо',
    //             text: 'Some text about fish',
    //         },
    //         {
    //             img: 'static/img/1200px-User_icon-cp.svg.png',
    //             title: 'Письмо',
    //             text: 'Some text about fish',
    //         },
    //     ],
    // },
};

export default class LoginView extends BaseView {
    renderPage() {
        const page = new Login(this.root, config);
        this.components.push(page);
        this.render();
    }


}