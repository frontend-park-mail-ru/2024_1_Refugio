'use strict'

import Header from './components/header/header.js';

const rootElement = document.querySelector('#root');
const headerElement = document.createElement('div');
headerElement.className = 'header';
rootElement.appendChild(headerElement);

const config = {
    header: {
        logo: {

        },
        search: {

        },
        menu: {

        },
    }
};
const header = new Header(headerElement, config.header);
header.render();
