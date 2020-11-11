const defaultFilter = {
    text: '',
    id: ''
}

export default (state=defaultFilter, action) => {
    switch (action.type) {
        case 'FILTER__BY__USERNAME': return {...state, text:action.text};
        case 'SET__CURRENT__CONTACT__ID': return {...state, id: action.id};
        default: return state;
    }
}