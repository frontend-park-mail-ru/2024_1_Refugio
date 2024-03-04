import Signup from './pages/signup/signup.js';

const rootElement = document.querySelector('#root');

const config = {
};


const signup = new Signup(rootElement, config);
signup.render();
