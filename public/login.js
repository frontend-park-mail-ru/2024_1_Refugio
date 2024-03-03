import Login from './pages/login/login.js';

const rootElement = document.querySelector('#root');

const config = {

};
const login = new Login(rootElement, config);
login.render();
