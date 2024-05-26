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

export const actionRedirect = (path, pushState, data = undefined) => ({
    type: 'open',
    value: { path: path, pushState: pushState, data: data },
})

export const actionRedirectToLetter = (id, pushState, folder) => ({
    type: 'openLetter',
    value: { id: id, pushState: pushState, folder: folder },
})

export const actionRedirectToWriteLetter = (id, pushState) => ({
    type: 'openWriteLetter',
    value: { id: id, pushState: pushState },
})

export const actionGetUser = () => ({
    type: 'getUser',
    value: {},
})

export const actionAvatarUpload = (file) => ({
    type: 'avatarUpload',
    value: { file: file },
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

export const actionUpdateEmail = (id, value, spam) => ({
    type: 'updateEmail',
    value: {id: id, value: value, spam: spam},

})

export const actionDeleteEmail = (id) => ({
    type: 'deleteEmail',
    value: { id: id },
})

export const actionLogout = () => ({
    type: 'logout',
    value: {},
})

export const actionDeleteAccount = (id) => ({
    type: 'deleteAccount',
    value: id,
})

export const actionGetQuestions = () => ({
    type: 'questions',
    value: {},
})

export const actionSendStat = (id, value) => ({
    type: 'sendStat',
    value: { id: id, value: value },
})

export const actionGetStatistic = () => ({
    type: 'stat',
    value: {},
})

export const actionStar = (id) => ({
    type: 'star',
    value: { id: id },
})

export const actionCreateFolder = (value) => ({
    type: 'createFolder',
    value: value,
})

export const actionGetFolders = () => ({
    type: 'getFolders',
    value: {},
})

export const actionGetLetterFolders = (id) => ({
    type: 'getLetterFolders',
    value: id,
})

export const actionUpdateFolder = (id, value) => ({
    type: 'updateFolder',
    value: { id: id, value: value },
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

export const actionDeleteLetterFromFolder = (value) => ({
    type: 'deleteLetterFromFolder',
    value: value,
})

export const actionGetSpam = () => ({
    type: 'getSpam',
    value: {},
})

export const actionGetAuthUrlSignUpVK = () => ({
    type: 'getAuthUrlSignUpVK',
    value: {},
})

export const actionGetAuthUrlLoginVK = () => ({
    type: 'getAuthUrlLoginVK',
    value: {},
})

export const actionGetVkAuthInfo = (code) => ({
    type: 'getVkAuthInfo',
    value: code,
})

export const actionVkLogin = (code) => ({
    type: 'vkLogin',
    value: code,
})

export const actionVkAuthSignup = (newUser, authtoken) => ({
    type: 'vkSignup',
    value: {newUser: newUser, authtoken: authtoken},
})

export const actionAttachFile = (file) => ({
    type: 'attachFile',
    value: { file: file },
})

export const actionDeleteAttachment = (id) => ({
    type: 'deleteAttachment',
    value: id,
})

export const actionBindAttachmnetsToLetter = (letterId, attachmentId) => ({
    type: 'bindAttachmentToLetter',
    value: { letterId: letterId, attachmentId: attachmentId }
})

export const actionGetAttachments = (id) => ({
    type: 'getAttachments',
    value: id,
})

