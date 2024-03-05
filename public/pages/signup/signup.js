import Signup_Box from "../../components/signup-box/signup-box.js";
import ajax from "../../modules/ajax.js";
import LoginView from "../../views/login.js";

export default class Signup {
    #parent
    #config

    constructor(parent, config) {
        this.#config = config;
        this.#parent = parent;
    }

    render() {
        const template = Handlebars.templates['signup.hbs'];
        const elements = {
            signup_box: new Signup_Box(null, this.#config).render(),
        };
        this.#parent.insertAdjacentHTML('beforeend', template(elements));
    }


    addListeners() {
        this.#parent
            .querySelector('.signup-container__signup-btn')
            .addEventListener('click', (async (e) => {

                e.preventDefault();


                const nameInput = document.querySelector('.signup-container__input[type="text"][placeholder="Имя"]');
                const surnameInput = document.querySelector('.signup-container__input[type="text"][placeholder="Фамилия"]');
                const emailInput = document.querySelector('.signup-container__input[type="email"]');
                const passwordInput = document.querySelector('.signup-container__input[type="password"][placeholder="Пароль"]');


                const name = nameInput.value.trim();
                const surname = surnameInput.value.trim();
                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();



                // create JSON object with user data
                const newUser = {
                    login: email,
                    name: name,
                    password: password,
                    surname: surname,

                };

                const response = await ajax(
                    'POST', 'http://89.208.223.140:8080/api/v1/signup', JSON.stringify(newUser), 'application/json'
                );

                if (response.ok) {
                    // registration successful
                    const login = new LoginView();
                    login.renderPage();
                }

            }));

        this.#parent
            .querySelector('.signup-container__login-ref')
            .addEventListener('click', (e) => {
                e.preventDefault();

                const loginView = new LoginView();

                loginView.renderPage();

            });
    }

    removeListeners() {
        this.#parent
            .querySelector('.signup-container__signup-btn')
            .addEventListener('click', (async (e) => {

                e.preventDefault();

                const emailInput = document.querySelector('.signup-container__input[type="email"]');
                const passwordInput = document.querySelector('.signup-container__input[type="password"][placeholder="Пароль"]');

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
                    'POST', 'http://89.208.223.140:8080/api/v1/signup', JSON.stringify(newUser), 'application/json'
                );


            }));

        this.#parent
            .querySelector('.signup-container__login-ref')
            .addEventListener('click', (e) => {
                e.preventDefault();

                const loginView = new LoginView();

                loginView.renderPage();

            });
    }

}