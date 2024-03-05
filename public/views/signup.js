import Signup from '../pages/signup/signup.js'
import BaseView from './base.js'

const config = {
};

export default class SignupView extends BaseView {

    constructor() {
        super();
    }
    renderPage() {
        this.clear();
        const page = new Signup(this.root, config);
        this.components.push(page);
        this.render();
        this.addListeners();
    }

}