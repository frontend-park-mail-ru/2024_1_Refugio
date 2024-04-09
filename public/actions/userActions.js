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

export const actionRedirect = (path, pushState) => ({
    type: 'open', 
    value: {path: path, pushState: pushState},
})

export const actionRedirectToLetter = (id, pushState) => ({
    type: 'openLetter', 
    value: {id: id, pushState: pushState},
})

export const actionGetUser = () => ({
    type: 'getUser',
    value: {},
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

// export const actionUpdate = (value) => ({
//     type: 'update',
//     value: value,
// })

export const actionLogout = () => ({
    type: 'logout',
    value: {},
})