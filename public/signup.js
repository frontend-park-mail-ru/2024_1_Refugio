import Signup from './pages/signup/signup.js';
import LoginView from "./views/login.js";
import MainView from "./views/main.js";
import ajax from "./modules/ajax.js";

const rootElement = document.querySelector('#root');

const config = {};


const signup = new Signup(rootElement, config);
signup.render();

const signupButton = document.getElementById('signupBtn');

signupButton.addEventListener('click', (async () => {

    event.preventDefault();

    const firstNameInput = document.querySelector('.signup-container__input[type="text"][placeholder="Имя"]');
    const lastNameInput = document.querySelector('.signup-container__input[type="text"][placeholder="Фамилия"]');
    const emailInput = document.querySelector('.signup-container__input[type="email"]');
    const passwordInput = document.querySelector('.signup-container__input[type="password"][placeholder="Пароль"]');
    const confirmPasswordInput = document.querySelector('.signup-container__input[type="password"][placeholder="Повторите пароль"]');

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert('Все поля должны быть заполнены.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Пароли не совпадают.');
        return;
    }

    // create JSON object with user data
    const newUser = {
        login: email,
        password: password,
    };

    const response = await ajax(
        'POST', 'http://89.208.223.140:8080/api/v1/signup', JSON.stringify(newUser), 'application/json'
    );

    if (response.ok) {
        // registration successful
        alert('Регистрация прошла успешно!');
    } else {
        // registration failed
        const errorMessage = await response.text();
        alert(`Регистрация не удалась: ${errorMessage}`);
    }
}));

