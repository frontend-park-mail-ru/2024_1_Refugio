import Login_Box from '../../components/login-box/login-box.js';
import ajax from '../../modules/ajax.js';
import MainView from '../../views/main.js';

export default class Login {
    #parent
    #config

    constructor(parent, config) {
        this.#config = config;
        this.#parent = parent;
    }

    render() {
        const template = Handlebars.templates['login.hbs'];
        const elements = {
            login_box: new Login_Box(null, this.#config).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }

    addListeners() {
        this.#parent
            .querySelector('.login-container__login-btn')
            .addEventListener('click', (async (e) => {

                e.preventDefault();

                const emailInput = document.querySelector('.login-container__input[type="email"]');
                const passwordInput = document.querySelector('.login-container__input[type="password"][placeholder="Пароль"]');

                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();

                if (!email || !password) {
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
                    const main = new MainView();
                    main.renderPage();
                } else {
                    // registration failed
                    const errorMessage = await response.text();
                    alert(`Авторизация не удалась: ${errorMessage}`);
                }
            }));
    }

    removeListeners() {
        this.#parent
            .querySelector('.login-container__login-btn')
            .removeEventListener('click', (async (e) => {

                e.preventDefault();

                const emailInput = document.querySelector('.login-container__input[type="email"]');
                const passwordInput = document.querySelector('.login-container__input[type="password"][placeholder="Пароль"]');

                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();

                if (!email || !password) {
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
    }
}