import Header from './components/header/header.js';
import Menu from './components/menu/menu.js';
import List_letter from './components/list-letter/list-letter.js';

const rootElement = document.querySelector('#root');
const headerElement = document.createElement('div');
headerElement.className = 'header';
const menuElement = document.createElement('div');
menuElement.className = 'aside';
const contentElement = document.createElement('div');
contentElement.className = 'content';
rootElement.appendChild(headerElement);
rootElement.appendChild(menuElement);
rootElement.appendChild(contentElement);

const config = {
    header: {
        logo: {

        },
        search: {

        },
        menu: {

        },
    },
    menu: {},
    content: {},
};
const header = new Header(headerElement, config.header);
header.render();
const menu = new Menu(menuElement, config.menu);
menu.render();
for (let i=0; i<3; i++){
    const list_letter = new List_letter(contentElement, config.content);
    list_letter.render();
}
