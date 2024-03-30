import userStore from "../stores/userStore.js";
import router from "../modules/router.js";

const handlers = [
    {type: 'verifyAuth', method: userStore.verifyAuth.bind(userStore)},
    {type: 'navigate', method: router.navigate.bind(router)},
    {type: 'open', method: router.open.bind(router)},
    {type: 'login', method: userStore.login.bind(userStore)},
    {type: 'signup', method: userStore.signup.bind(userStore)},
    {type: 'start', method: router.start.bind(router)},
    {type: 'getUser', method: userStore.getUser.bind(userStore)},
    {type: 'logout', method: userStore.logout.bind(userStore)},
];

export default handlers;