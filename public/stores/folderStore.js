import userStore from "./userStore.js";
import ajax from "../modules/ajax.js";
import mediator from "../modules/mediator.js";

class folderStore {
    folders

    constructor() {
        this.folders = undefined;
    }

    clean() {
        this.folders = undefined;
    }

    async create(newFolder) {
        const response = await ajax(
            'POST', 'https://mailhub.su/api/v1/folder/add', JSON.stringify(newFolder), 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        mediator.emit('createFolder', status);
    }

    async update({id, value}) {
        const response = await ajax(
            'PUT', `https://mailhub.su/api/v1/folder/update/${id}`, JSON.stringify(value), 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        mediator.emit('updateFolder', {status:status, id: id});
    }

    async delete(id) {
        const response = await ajax(
            'DELETE', `https://mailhub.su/api/v1/folder/delete/${id}`, null, 'application/json', userStore.getCsrf()
        );
        const status = await response.status;
        mediator.emit('deleteFolder', {status:status, id: id});
    }

    async getFolders() {
        const response = await ajax(
            'GET', 'https://mailhub.su/api/v1/folder/all', null, 'application/json', userStore.getCsrf()
        );
        const data = await response.json();
        this.folders = data.body.folders;
        return this.folders;
    }
}

export default new folderStore();