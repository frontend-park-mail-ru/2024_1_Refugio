import ajax from "../modules/ajax.js";
import mediator from "../modules/mediator.js";
import emailStore from "./emailStore.js";

/**
 * Класс хранилища для пользователя и авторизации
 * @class
 */
class UserStore {
    body
    isAuth
    #csrf

    /**
     * Конструктор класса
     * @constructor
     */
    constructor() {
        this.body = undefined;
        this.isAuth = false;
        this.#csrf = undefined;
    }

    /**
     * Функция формирования запроса проверки авторизации на сервере
     */
    async verifyAuth() {
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/verify-auth', null, 'application/json', this.#csrf
        );
        this.isAuth = await response.status < 300;
        this.#csrf = response.headers.get('X-Csrf-Token');
        return this.isAuth;
    }

    /**
     * Функция формирования запроса разлогинивания на сервере
     */
    async logout() {
        const response = await ajax(
            'POST', 'https://mailhub.su/api/v1/auth/logout', null, 'application/json', this.#csrf
        );
        const status = await response.status;
        if (status < 300) {
            this.isAuth = false;
            this.body = undefined;
        }
        emailStore.clean();
        mediator.emit('logout', status);
    }

    /**
     * Функция формирования запроса авторизации на сервере
     */
    async login(newUser) {
        const response = await ajax(
            'POST', 'https://mailhub.su/api/v1/auth/login', JSON.stringify(newUser), 'application/json', this.#csrf
        );

        const status = await response.status;
        if (status < 300) {
            this.isAuth = true;
        }
        this.#csrf = response.headers.get('X-Csrf-Token');
        mediator.emit('login', status);
    }

    /**
     * Функция формирования запроса регистрации на сервере
     */
    async signup(newUser) {
        const response = await ajax(
            'POST', 'https://mailhub.su/api/v1/auth/signup', JSON.stringify(newUser), 'application/json', this.#csrf
        );
        const status = await response.status;
        if (status < 300) {
            this.isAuth = true;
        }
        this.#csrf = await response.headers.get('X-Csrf-Token');
        mediator.emit('signup', status);
    }

    /**
     * Функция возвращения токена csrf
     */
    getCsrf() {
        return this.#csrf
    }

    /**
     * Функция формирования запроса получения информации о пользователе с сервера 
     */
    async getUser() {
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/user/get', null, 'application/json', this.#csrf
        );
        const status = await response.status;
        if (status < 300) {
            let data = await response.json();
            this.body = data.body.user;
        }
    }

    /**
     * Функция формирования запроса обновления настроек пользователя на сервере
     */
    async updateUser(newUser) {
        const response = await ajax(
            'PUT', 'https://mailhub.su/api/v1/user/update', JSON.stringify(newUser), 'application/json', this.#csrf
        );
        const status = await response.status;
        mediator.emit('updateUser', status);
    }

    /**
     * Функция формирования запроса загрузки аватара на сервер
     */
    async avatarUpload(file) {
        const response = await ajax(
            'POST', 'https://mailhub.su/api/v1/user/avatar/upload', file.file, undefined, this.#csrf
        );
        const status = await response.status;
        mediator.emit('avatarUpload', status);
    }

    async getAuthUrlSignUpVK() {
        const response = await ajax(
            'GET', `https://mailhub.su/api/v1/testAuth/auth-vk/getAuthUrlSignUpVK`, null, 'application/json', this.#csrf
        );

        const status = await response.status;
        const data = await response.json();
        const link =  data.body.AuthURL;
        console.log(link);
        mediator.emit('getAuthUrlSignUpVK', { status, link });
    }
}

export default new UserStore();