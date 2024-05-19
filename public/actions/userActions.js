export const actionStart = () => ({
    type: 'start',
    value: {},
})

export const actionLogin = (value) => ({
    type: 'login',
    value: value,
})

export const actionSignup = (value) => ({
    type: 'signup',
    value: value,
})

export const actionRedirect = (path, pushState, data=undefined) => ({
    type: 'open', 
    value: {path: path, pushState: pushState, data: data},
})

export const actionRedirectToLetter = (id, pushState, folder) => ({
    type: 'openLetter', 
    value: {id: id, pushState: pushState, folder: folder},
})

export const actionGetUser = () => ({
    type: 'getUser',
    value: {},
})

export const actionAvatarUpload = (file) => ({
    type: 'avatarUpload',
    value: {file: file},
})

export const actionUpdateUser = (value) => ({
    type: 'updateUser',
    value: value,
})

export const actionGetIncoming = () => ({
    type: 'getIncoming',
    value: {},
})

export const actionGetSent = () => ({
    type: 'getSent',
    value: {},
})

export const actionGetEmail = (id) => ({
    type: 'getEmail',
    value: id,
})

export const actionSend = (value) => ({
    type: 'send',
    value: value,
})

export const actionUpdateEmail = (id, value) => ({
    type: 'updateEmail',
    value: {id: id, value: value},
})

export const actionDeleteEmail = (id) => ({
    type: 'deleteEmail',
    value: {id: id},
})

export const actionLogout = () => ({
    type: 'logout',
    value: {},
})

export const actionGetQuestions = () => ({
    type: 'questions',
    value: {},
})

export const actionSendStat = (id, value) => ({
    type: 'sendStat',
    value: {id: id, value: value},
})

export const actionGetStatistic = () => ({
    type: 'stat',
    value: {},
})

export const actionStar = (id) => ({
    type: 'star',
    value: {id: id},
})

export const actionCreateFolder = (value) => ({
    type: 'createFolder',
    value: value,
})

export const actionGetFolders = () => ({
    type: 'getFolders',
    value: {},
})

export const actionUpdateFolder = (id, value) => ({
    type: 'updateFolder',
    value: {id: id, value: value},
})

export const actionDeleteFolder = (id) => ({
    type: 'deleteFolder',
    value: id,
})

export const actionGetFolderEmails = (id) => ({
    type: 'getFolderEmails',
    value: id,
})

export const actionAddLetterToFolder = (value) => ({
    type: 'addLetterToFolder',
    value: value,
})

export const actionGetDrafts = () => ({
    type: 'getDrafts',
    value: {},
})

export const actionGetSpam = () => ({
    type: 'getSpam',
    value: {},
})

export const actionGetAuthUrlSignUpVK = () => ({
    type: 'getAuthUrlSignUpVK',
    value: {},
})

export const actionGetVkAuthInfo= (code) => ({
    type: 'getVkAuthInfo',
    value: code,
})