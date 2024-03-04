import Login from './pages/login/login.js';
import ajax from "./modules/ajax.js";

const rootElement = document.querySelector('#root');

const config = {
};


const login = new Login(rootElement, config);
login.render();



const loginButton = document.getElementById('loginBtn');

loginButton.addEventListener('click', (async () => {

    event.preventDefault();

    const emailInput = document.querySelector('.login-container__input[type="email"]');
    const passwordInput = document.querySelector('.login-container__input[type="password"][placeholder="Пароль"]');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if ( !email || !password) {
        alert('Все поля должны быть заполнены.');
        return;
    }

    // create JSON object with user data
    const newUser = {
        login: email,
        password: password,
    };

    const response = await ajax(
        'POST', 'http://89.208.223.140:8080/api/v1/login', JSON.stringify(newUser), 'application/json'
    );

    if (response.ok) {
        // registration successful
        alert('Авторизация прошла успешно!');
    } else {
        // registration failed
        const errorMessage = await response.text();
        alert(`Авторизация не удалась: ${errorMessage}`);
    }
}));