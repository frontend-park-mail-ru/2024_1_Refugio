import userStore from "../stores/userStore.js";
import emailStore from "../stores/emailStore.js";
import folderStore from "../stores/folderStore.js";
import draftStore from "../stores/draftStore.js";
import router from "../modules/router.js";

const handlers = [
    { type: 'verifyAuth', method: userStore.verifyAuth.bind(userStore) },
    { type: 'navigate', method: router.navigate.bind(router) },
    { type: 'open', method: router.open.bind(router) },
    { type: 'openLetter', method: router.openLetter.bind(router) },
    { type: 'openWriteLetter', method: router.openWriteLetter.bind(router) },

    { type: 'login', method: userStore.login.bind(userStore) },
    { type: 'signup', method: userStore.signup.bind(userStore) },
    { type: 'start', method: router.start.bind(router) },
    { type: 'getUser', method: userStore.getUser.bind(userStore) },
    { type: 'updateUser', method: userStore.updateUser.bind(userStore) },
    { type: 'logout', method: userStore.logout.bind(userStore) },
    { type: 'getIncoming', method: emailStore.getIncoming.bind(emailStore) },
    { type: 'getSent', method: emailStore.getSent.bind(emailStore) },
    { type: 'getEmail', method: emailStore.getEmail.bind(emailStore) },
    { type: 'send', method: emailStore.send.bind(emailStore) },
    { type: 'updateEmail', method: emailStore.updateEmail.bind(emailStore) },
    { type: 'deleteEmail', method: emailStore.deleteEmail.bind(emailStore) },
    { type: 'avatarUpload', method: userStore.avatarUpload.bind(userStore) },
    { type: 'createFolder', method: folderStore.create.bind(folderStore) },
    { type: 'getFolders', method: folderStore.getFolders.bind(folderStore) },
    { type: 'getLetterFolders', method: folderStore.getLetterFolders.bind(folderStore) },
    { type: 'updateFolder', method: folderStore.update.bind(folderStore) },
    { type: 'deleteFolder', method: folderStore.delete.bind(folderStore) },
    { type: 'getFolderEmails', method: folderStore.getFolderEmails.bind(folderStore) },
    { type: 'addLetterToFolder', method: folderStore.addLetter.bind(folderStore) },
    { type: 'deleteLetterFromFolder', method: folderStore.deleteLetter.bind(folderStore) },
    { type: 'getDrafts', method: draftStore.getDrafts.bind(draftStore) },
    { type: 'addDraft', method: draftStore.create.bind(draftStore) },
    { type: 'typingAddDraft', method: draftStore.typingCreate.bind(draftStore) },

    { type: 'sendDraft', method: draftStore.send.bind(draftStore) },
    { type: 'updateDraft', method: draftStore.update.bind(draftStore) },
    { type: 'typingUpdateDraft', method: draftStore.typingUpdate.bind(draftStore) },

    { type: 'getSpam', method: emailStore.getSpam.bind(emailStore) },
    { type: 'getAuthUrlSignUpVK', method: userStore.getAuthUrlSignUpVK.bind(userStore) },
    { type: 'getAuthUrlLoginVK', method: userStore.getAuthUrlLoginVK.bind(userStore) },

    { type: 'getVkAuthInfo', method: userStore.getVkAuthInfo.bind(userStore) },
    { type: 'vkSignup', method: userStore.vkAuthSignup.bind(userStore) },
    { type: 'attachFile', method: emailStore.attachFile.bind(emailStore) },
    { type: 'deleteAttachment', method: emailStore.deleteAttachment.bind(emailStore) },
    { type: 'bindAttachmentToLetter', method: emailStore.bindAttachmentToLetter.bind(emailStore) },
    { type: 'getAttachments', method: emailStore.getAttachments.bind(emailStore) },
    { type: 'vkLogin', method: userStore.vkLogin.bind(userStore) },
    { type: 'deleteAccount', method: userStore.deleteAccount.bind(userStore) },
];

export default handlers;