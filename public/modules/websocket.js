

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
        // const letter = List_letter(null, {
        //     sent: this.#config.sent,
        //     status: letter.readStatus,
        //     avatar: letter.photoId,
        //     from: letter.senderEmail,
        //     to: letter.recipientEmail,
        //     subject: letter.topic,
        //     text: letter.text,
        //     date: letter.dateOfDispatch,
        //     id: letter.id,
        // })

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

