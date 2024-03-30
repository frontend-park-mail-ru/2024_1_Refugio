import userStore from "../stores/userStore.js";
import router from "../modules/router.js";

const handlers = [
    {type: 'verifyAuth', method: userStore.verifyAuth.bind(userStore)},
    {type: 'navigate', method: router.navigate.bind(router)},
    {type: 'open', method: router.open.bind(router)},
    {type: 'login', method: userStore.login.bind(userStore)},
    {type: 'start', method: router.start.bind(router)},
];

export default handlers;