import ajax from "../modules/ajax.js";
import mediator from "../modules/mediator.js";

class UserStore {
    #body
    isAuth
    
    constructor() {
        this.#body = undefined;
        this.isAuth = false;
    }

    async verifyAuth() {
        const response = await ajax(
            'GET', 'http://89.208.223.140:8080/api/v1/verify-auth', null, 'application/json'
        );
        this.isAuth = await response.status < 300;
        return this.isAuth;
    }

    async login(newUser) {
        const response = await ajax(
            'POST', 'http://89.208.223.140:8080/api/v1/login', JSON.stringify(newUser), 'application/json'
        );

        const status = await response.status;
        if (status < 300) {
            this.isAuth = true;
        }
        mediator.emit('login', status);
    }

    async getUser() {
        const response = await ajax(
            'GET', 'http://89.208.223.140:8080/api/v1/get-user', null, 'application/json'
        );
        const status = await response.status;
        if (status < 300) {
            let data = await response.json();
            this.body = data.body.user;
        }
        console.log(this.body);
    }
}

export default new UserStore();