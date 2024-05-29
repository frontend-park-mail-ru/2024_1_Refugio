

export default class Websocket {
    #ws


    constructor(url) {
        this.#ws = new WebSocket(url);
        console.log(url, this.#ws);
        this.#addEventListeners();
    }

    #removeEventListenes() {
        this.#ws.removeEventListener('open', this.#onopen);
        this.#ws.removeEventListener('message', this.#onmessage);
        this.#ws.removeEventListener('error', this.#onerror);
        this.#ws.removeEventListener('close', this.#onclose);
    }

    #onopen = () => {
        console.log('opened');
        this.#ws.send('testtt');
    }

    #onmessage = (event) => {
        console.log('message', event.data);
    }

    #onerror = (error) => {
        console.log('error', error.message);
    }

    #onclose = (event) => {
        this.#removeEventListenes();
        console.log(event.code);
    }

    #addEventListeners() {
        this.#ws.addEventListener('open', this.#onopen);
        this.#ws.addEventListener('message', this.#onmessage);
        this.#ws.addEventListener('error', this.#onerror);
        this.#ws.addEventListener('close', this.#onclose);
    }




}

