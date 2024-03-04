import MainView from './views/main.js';
import LoginView from './views/login.js';
import ajax from '../modules/ajax.js';

(async () => {
    const response = await ajax(
        'GET', 'http://89.208.223.140:8080/api/v1/verify-auth', null, 'application/json'
    );
    const status = await response.status;
    const data = await response.json();
    if (status <= 300) {
        const login = new LoginView();
        login.renderPage();
    } else {
        const main = new MainView();
        main.renderPage();
    };
})()

// let isAuth;
// ajax(
//     'GET', 'http://89.208.223.140:8080/api/v1/verify-auth', null, 'application/json', (status, data) => (isAuth = status)
// );
// console.log(isAuth);
// if (!isAuth) {
//     const login = new LoginView();
//     login.renderPage();
// } else {
//     const main = new MainView();
//     main.renderPage();
// };