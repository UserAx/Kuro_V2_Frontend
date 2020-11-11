const defaultUser = {};
import {PURGE} from 'redux-persist';

export default (state = defaultUser, action) => {
    switch(action.type) {
        case 'ADD_USER':
            return {...action.user, token: action.token};
        case 'REMOVE_USER': 
            return {};
        case 'EDIT_USER': 
            return {...state, ...action.updates};
        case 'SET_USER': 
            return {...action.user, token: action.token};
        case 'EDIT_USER_CONTACTS': 
            return {...state, contacts: action.contacts};
        case PURGE : return {};
        default: return state;
    }
}