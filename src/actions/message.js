import axios from 'axios';
const BASEURL = process.env.BASEURL;

const generateAxiosInstance = (token = '') => {
    const instance = axios.create({
        baseURL: BASEURL,
        headers: {
            // 'Access-Control-Allow-Origin': '*', 
            'Authorization': `Bearer ${token}`
        }
    });
    return instance;
}

export const startFetchMessages = (token, contactId) => {
    return () => {
        return generateAxiosInstance(token).get(`/messages/${contactId}`);
    }
}

export const startRemoveMessages = (token, messageId) => {
    return () => {
        return generateAxiosInstance(token).delete(`/messages/${messageId}`);
    }
}

export const startPostMessage = (token, message) => {
    return () => {
        return generateAxiosInstance(token).post('/messages', message);
    }
}

export const startPostAttachment = (token, messageId, attachment) => {
    return () => {
        const formData = new FormData();
        formData.append('messageAttachment', attachment);
        return generateAxiosInstance(token)
        .post(`/messages/${messageId}/attachment`, formData, {headers: {'Content-Type': 'multipart/form-data'}});
    }
}

export const startFetchAttachment = (token, contactId, messageId) => {
    return () => {
        return generateAxiosInstance(token).get(`/messages/${contactId}/${messageId}/attachment`);
    }
}

export const startFetchMessageAlert = (token, contactId) => {
    return () => {
        return generateAxiosInstance(token).get(`/messages/${contactId}/messageAlert`);
    }
}