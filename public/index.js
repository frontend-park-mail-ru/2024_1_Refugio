import MainView from './views/main.js';
import LoginView from './views/login.js';
import { ajax } from '../modules/ajax.js';

let isAuth;
ajax(
    'GET', 'http://89.208.223.140:8080/api/v1/verify-auth', null, 'application/json', (status, data) => (isAuth = status === 200)
);
if (!isAuth) {
    const login = new LoginView();
    login.renderPage();
} else {
    const main = new MainView();
    main.renderPage();
};