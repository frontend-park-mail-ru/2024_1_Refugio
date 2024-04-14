import "../stores/userStore.js";
import "../stores/emailStore.js";
import "../modules/router.js";

const handlers = [
    {type: 'verifyAuth', method: userStore.verifyAuth.bind(userStore)},
    {type: 'navigate', method: router.navigate.bind(router)},
    {type: 'open', method: router.open.bind(router)},
    {type: 'openLetter', method: router.openLetter.bind(router)},
    {type: 'login', method: userStore.login.bind(userStore)},
    {type: 'signup', method: userStore.signup.bind(userStore)},
    {type: 'start', method: router.start.bind(router)},
    {type: 'getUser', method: userStore.getUser.bind(userStore)},
    {type: 'updateUser', method: userStore.updateUser.bind(userStore)},
    {type: 'logout', method: userStore.logout.bind(userStore)},
    {type: 'getIncoming', method: emailStore.getIncoming.bind(emailStore)},
    {type: 'getSent', method: emailStore.getSent.bind(emailStore)},
    {type: 'getEmail', method: emailStore.getEmail.bind(emailStore)},
    {type: 'send', method: emailStore.send.bind(emailStore)},

    {type: 'updateEmail', method: emailStore.updateEmail.bind(emailStore)},
    {type: 'deleteEmail', method: emailStore.deleteEmail.bind(emailStore)},

    {type: 'avatarUpload', method: userStore.avatarUpload.bind(userStore)},

];

export default handlers;