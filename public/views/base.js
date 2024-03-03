export default class BaseView {
    components=[];
    root;

    constructor() {
        this.root = document.querySelector('#root');
    }

    render() {
        this.components.forEach((component) => component.render())
    }
}