import ajax from "../modules/ajax.js";
import mediator from "../modules/mediator.js";
import emailStore from "./emailStore.js";

class UserStore {
    body
    isAuth
    #csrf

    constructor() {
        this.body = undefined;
        this.isAuth = false;
        this.#csrf = undefined;
    }

    async verifyAuth() {
        const response = await ajax(
            'GET', 'https://mailhub.su:8080/api/v1/verify-auth', null, 'application/json', this.#csrf
        );
        this.isAuth = await response.status < 300;
        this.#csrf = response.headers.get('X-Csrf-Token');
        return this.isAuth;
    }

    async logout() {
        const response = await ajax(
            'POST', 'https://mailhub.su:8080/api/v1/auth/logout', null, 'application/json', this.#csrf
        );
        const status = await response.status;
        if (status < 300) {
            this.isAuth = false;
            this.body = undefined;
        }
        emailStore.clean();
        mediator.emit('logout', status);
    }

    async login(newUser) {
        const response = await ajax(
            'POST', 'https://mailhub.su:8080/api/v1/auth/login', JSON.stringify(newUser), 'application/json', this.#csrf
        );

        const status = await response.status;
        if (status < 300) {
            this.isAuth = true;
        }
        this.#csrf = response.headers.get('X-Csrf-Token');
        mediator.emit('login', status);
    }

    async signup(newUser) {
        const response = await ajax(
            'POST', 'https://mailhub.su:8080/api/v1/auth/signup', JSON.stringify(newUser), 'application/json', this.#csrf
        );
        const status = await response.status;
        if (status < 300) {
            this.isAuth = true;
        }
        this.#csrf = await response.headers.get('X-Csrf-Token');
        mediator.emit('signup', status);
    }

    getCsrf() {
        return this.#csrf
    }

    async getUser() {
        const response = await ajax(
            'GET', 'https://mailhub.su:8080/api/v1/user/get', null, 'application/json', this.#csrf
        );
        const status = await response.status;
        if (status < 300) {
            let data = await response.json();
            this.body = data.body.user;
        }
    }

    async updateUser(newUser) {
        const response = await ajax(
            'PUT', 'https://mailhub.su:8080/api/v1/user/update', JSON.stringify(newUser), 'application/json', this.#csrf
        );
        const status = await response.status;
        mediator.emit('updateUser', status);
    }

    async avatarUpload(file) {
        const response = await ajax(
            'POST', 'https://mailhub.su:8080/api/v1/user/avatar/upload', file.file, undefined, this.#csrf
        );
        const status = await response.status;
        mediator.emit('updateUser', status);
    }
}

export default new UserStore();