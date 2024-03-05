import Login from '../pages/login/login.js'
import BaseView from './base.js'

const config = {
};

export default class LoginView extends BaseView {
    constructor() {
        super();
    }

    renderPage() {
        this.clear();
        const page = new Login(this.root, config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }


}