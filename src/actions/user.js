import axios from 'axios';
export const BASEURL = process.env.BASEURL;

const generateAxiosInstance = (token = '') => {
    const axiosInstance = axios.create({
        baseURL: BASEURL,
        headers: {
            // 'Access-Control-Allow-Origin': '*', 
            'Authorization': `Bearer ${token}`
        }
    });
    return axiosInstance;
}

export const addUser = (user = {}, token) => ({
    type: 'ADD_USER',
    user,
    token
});

export const setUser = (user = {}, token) => ({
    type: 'SET_USER',
    user,
    token
});

export const removeUser = () => ({
    type: 'REMOVE_USER'
});

export const editUser = (updates) => ({
    type: 'EDIT_USER',
    updates
});

export const editUserContacts = (contacts) => ({
    type: 'EDIT_USER_CONTACTS',
    contacts
});

export const editMessageAlert = (alertValue) => ({
    type: 'MESSAGE_ALERT',
    alertValue
});

export const startSignUpUser = (user) => {
    return (dispatch) => {
        return generateAxiosInstance().post('/users', {...user}).then((result) => {
            dispatch(addUser(result.data.user, result.data.token));
            return result.data.token;
        });
    }
};

export const startLogInUser = (email, password) => {
    return (dispatch) => {
        return generateAxiosInstance().post('/users/login', {email, password}).then((result) => {
            dispatch(addUser(result.data.user, result.data.token));
        });
    }
};

export const startLogoutUser = (token) => {
    return (dispatch) => {
        return generateAxiosInstance(token).get('/me/logout').then(() => {
            dispatch(removeUser());
        });
    }
};

export const startLogoutAllUser = (token) => {
    return (dispatch) => {
        return generateAxiosInstance(token).get('/me/logoutAll').then(() => {
            dispatch(removeUser());
        });
    }
};

export const startEditUser = (token, updates) => {
    return (dispatch) => {
        return generateAxiosInstance(token).patch('/me', {...updates}).then((result) => {
            dispatch(editUser(updates));
        });
    }
};

export const startAddAvatar = (token, avatar) => {
    return (dispatch) => {
        const formData = new FormData();
        formData.append('userAvatar', avatar);
        return generateAxiosInstance(token)
        .post('/me/avatar', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(() => {
            dispatch(editUser({hasAvatar: true}));
        });
    }
};

export const startHasAvatar = (id) => {
    return () => {
        return generateAxiosInstance().get(`/users/${id}/hasAvatar`);
    }
}

export const startDeleteAvatar = (token) => {
    return (dispatch) => {
        return generateAxiosInstance(token).delete('/me/avatar').then(() => {
            dispatch(editUser({hasAvatar: false}));
        });
    }
};

export const startFindContacts = (token, findContact) =>{
    return () => {
        return generateAxiosInstance(token).get(`/me/users/find=${findContact}`);
    }
}

export const startFetchContactDetails = (token, contactId) => {
    return () => {
        return generateAxiosInstance(token).get(`/me/contactdetails/id=${contactId}`);
    }
} 

export const startAddContact = (token, contactId) => {
    return (dispatch) => {
        return generateAxiosInstance(token).post(`/me/contacts`, {contactId}).then((result) => {
            dispatch(editUserContacts(result.data));
        });
    }
};

export const startDeleteContact = (token, contactId) => {
    return (dispatch) => {
        return generateAxiosInstance(token).delete(`/me/contacts/${contactId}`).then((result) => {
            dispatch(editUserContacts(result.data));
        });
    }
};

export const startDeleteUser = (token) => {
    return (dispatch) => {
        return generateAxiosInstance(token).delete('/me').then((result) => {
            dispatch(removeUser());
        });
    }  
};

export const startFetchContacts = (token) => {
    return (dispatch) => {
        return generateAxiosInstance(token).get('/me/contacts').then((result) => {
            dispatch(editUserContacts(result.data));
        });
    }
}