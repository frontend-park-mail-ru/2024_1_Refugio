import Main from './pages/main/main.js';

const rootElement = document.querySelector('#root');

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
const main = new Main(rootElement, config);
main.render();
