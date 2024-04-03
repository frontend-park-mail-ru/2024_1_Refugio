import dispathcher from './modules/dispathcher.js';
import { actionStart } from './actions/userActions.js';
import LetterView from './views/letter.js';
import ProfileView from './views/profile.js';

// dispathcher.do(actionStart());

const view = new ProfileView();
view.renderPage();


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