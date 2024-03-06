export default class BaseView {
    components = [];
    root;

    constructor() {
        this.root = document.querySelector('#root');
    }

    render() {
        this.components.forEach((component) => component.render())
    }

    addListeners() {
        this.components.forEach((component) => component.addListeners());
    }

    removeListeners() {
        this.components.forEach((component) => component.removeListeners());
    }

    clear() {
        this.removeListeners();
        this.root.innerHTML='';
        this.components=[];
    }
}