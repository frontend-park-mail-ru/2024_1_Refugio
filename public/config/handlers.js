import userStore from "../stores/userStore.js";
import emailStore from "../stores/emailStore.js";
import statStore from "../stores/statStore.js";
import folderStore from "../stores/folderStore.js";
import router from "../modules/router.js";

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
    {type: 'questions', method: statStore.getQuestions.bind(statStore)},
    {type: 'sendStat', method: statStore.send.bind(statStore)},
    {type: 'stat', method: statStore.getStat.bind(statStore)},
    {type: 'star', method: statStore.changeStar.bind(statStore)},
    {type: 'createFolder', method: folderStore.create.bind(folderStore)},
    {type: 'getFolders', method: folderStore.getFolders.bind(folderStore)},
    {type: 'updateFolder', method: folderStore.update.bind(folderStore)},
    {type: 'deleteFolder', method: folderStore.delete.bind(folderStore)},
    {type: 'getFolderEmails', method: folderStore.getFolderEmails.bind(folderStore)},
    {type: 'addLetterToFolder', method: folderStore.addLetter.bind(folderStore)},
    {type: 'getDrafts', method: emailStore.getDrafts.bind(emailStore)},
    {type: 'getSpam', method: emailStore.getSpam.bind(emailStore)},
];

export default handlers;