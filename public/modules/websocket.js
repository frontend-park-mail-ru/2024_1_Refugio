import List_letter from '../components/list-letter/list-letter.js';
import dispathcher from './dispathcher.js';
import {actionWebSocketListLettersUpdate} from '../actions/userActions.js'

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


        // status: !this.#config.status,
        // avatar: this.#config.avatar,
        // from: this.#config.from,
        // subject: this.#config.subject,
        // text: this.cleanText(this.#config.text),
        // date: (new Date(this.#config.date)).toLocaleDateString('ru-RU', { timeZone: 'UTC' }),
        // id: this.#config.id,
        // userLetter: this.#config.from.charAt(0),

        console.log(event.data);
        const config = {
            status: event.data.readStatus,
            // avatar: this.#config.avatar,
            from: event.data.senderEmail,
            subject: event.data.topic,
            text: event.data.text,
            // date:
            date: (new Date()).toLocaleDateString('ru-RU', { timeZone: 'UTC' }),
            id: event.data.id,
            // userLetter: event.data.senderEmail?.charAt(0),
        }


        console.log('message', event.data);
        dispathcher.do(actionWebSocketListLettersUpdate(new List_letter(null, {
            config
            // status: event.data.readStatus,
            // // avatar: data.body.email.photoId,
            // from: event.data.senderEmail,
            // to: event.data.recipientEmail,
            // subject: event.data.topic,
            // text: event.data.text,
            // // date: data.body.email.dateOfDispatch,
            // id: event.data.id,
        }).render()));

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

