export const actionAddDraft = (value) => ({
    type: 'addDraft',
    value: value,
})

export const actionGetDrafts = () => ({
    type: 'getDrafts',
    value: {},
})

export const actionSendDraft = (id, value) => ({
    type: 'sendDraft',
    value: {id: id, value: value},
})

export const actionUpdateDraft = (id, value) => ({
    type: 'updateDraft',
    value: {id: id, value: value},
})