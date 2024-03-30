export const actionStart = () => ({
    type: 'start',
    value: {},
})

export const actionLogin = (value) => ({
    type: 'login',
    value: value,
})

export const actionRedirect = (path, pushState) => ({
    type: 'open', 
    value: {path: '/main', pushState: true},
})

export const actionGetUser = () => ({
    type: 'getUser',
    value: {},
})