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
    websocket


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
    async deleteAccount(id) {

        const response = await ajax(
            'DELETE', `https://mailhub.su/api/v1/user/delete/${id}`, null, 'application/json', this.#csrf
        );

        const data = await response;

        const status = await response.status;
        if (status < 300) {
            this.isAuth = false;
            this.body = undefined;
        }
        emailStore.clean();
        mediator.emit('deleteAccount', status);
    }

    async login(newUser) {
        const response = await ajax(
            'POST', 'https://mailhub.su/api/v1/auth/login', JSON.stringify(newUser), 'application/json', this.#csrf
        );

        const status = await response.status;
        if (status < 300) {
            this.isAuth = true;
            this.body = newUser;
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
        if (status < 300) {
            this.body = newUser;
        }
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
        const link = data.body.AuthURL;
        mediator.emit('getAuthUrlSignUpVK', { status, link });
    }

    async getAuthUrlLoginVK() {
        const response = await ajax(
            'GET', `https://mailhub.su/api/v1/testAuth/auth-vk/getAuthUrlLoginVK`, null, 'application/json', this.#csrf
        );
        const status = await response.status;
        const data = await response.json();
        const link = data.body.AuthURL;
        mediator.emit('getAuthUrlLoginVK', { status, link });
    }

    async getVkAuthInfo(code) {
        const response = await ajax(
            'GET', `https://mailhub.su/api/v1/testAuth/auth-vk/auth/${code}`, null, 'application/json', this.#csrf
        );

        const status = await response.status;
        const body = await response.json();
        const headers = await response.headers;
        const authtoken = headers.get('authtoken');

        mediator.emit('getVkAuthInfo', { status, body, authtoken });
    }

    async vkAuthSignup({ newUser, authtoken }) {
        const response = await ajax(
            'POST', `https://mailhub.su/api/v1/testAuth/auth-vk/signupVK`, JSON.stringify(newUser), 'application/json', this.#csrf, authtoken
        );

        const status = await response.status;
        if (status < 300) {
            this.isAuth = true;
            this.body = newUser;
        }
        this.#csrf = await response.headers.get('X-Csrf-Token');
        mediator.emit('vkSignup', status);
    }

    async vkLogin(code) {
        const response = await ajax(
            'GET', `https://mailhub.su/api/v1/testAuth/auth-vk/loginVK/${code}`, null, 'application/json', this.#csrf
        );

        const status = await response.status;
        if (status < 300) {
            this.isAuth = true;
        }
        this.#csrf = await response.headers.get('X-Csrf-Token');
        const data = await response.json();
        mediator.emit('vkLogin', data);
    }
}

export default new UserStore();