import List_letter from '../components/list-letter/list-letter.js';
import dispathcher from './dispathcher.js';

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
    }

    #onmessage = (event) => {

        

        const data = JSON.parse(event.data);
        console.log(data);
        dispathcher.do(actionWebSocketListLettersUpdate(new List_letter(null,
            {
                status: data.readStatus,
                avatar: data.photoId,
                from: data.senderEmail,
                to: data.recipientEmail,
                subject: data.topic,
                text: data.text,
                date: (new Date(data.dateOfDispatch)).toLocaleDateString('ru-RU', { timeZone: 'UTC' }),
                id: data.id,
            }
        ).render()));

    }

    #onerror = (error) => {
        console.log('error', error.message);
    }

    #onclose = (event) => {
        this.#removeEventListenes();
        console.log(event.code);
    }

    send = (data) => {
        this.#ws.send(data);
        console.log(data);
    }

    #addEventListeners() {
        this.#ws.addEventListener('open', this.#onopen);
        this.#ws.addEventListener('message', this.#onmessage);
        this.#ws.addEventListener('error', this.#onerror);
        this.#ws.addEventListener('close', this.#onclose);
    }
}

