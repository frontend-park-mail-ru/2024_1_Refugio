
import './modules/dispathcher.js';
import './actions/userActions.js';
// import LetterView from './views/letter.js';
// import ProfileView from './views/profile.js';
// import WriteLetterView from './views/write-letter.js';
// import MainView from './views/main.js';

dispathcher.do(actionStart());

// const view = MainView;
// console.log(view);
// view.renderPage();
//const view = new ProfileView();
//view.renderPage();

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