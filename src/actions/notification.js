import axios from 'axios';
const BASEURL = process.env.BASEURL;

const generateAxiosInstance = (token = '') => {
    const instance = axios.create({
        baseURL: BASEURL,
        headers: {'Access-Control-Allow-Origin':'*', 'Authorization': `Bearer ${token}`}
    });
    return instance;
}


export const startFetchNotifications = (token) => {
    return () => {
        return generateAxiosInstance(token).get('/me/notifications');
    }
}

//Notification object needs to have requestType, username as sender, senderId, receiverId.
//Sender username and id is add on server. So, I just need requestType and receiverId
export const startPostNotification = (token, notification) => {
    return () => {
        return generateAxiosInstance(token).post('/me/notifications', notification);
    }
}

export const startRemoveNotification = (token, notificationId) => {
    return () => {
        return generateAxiosInstance(token).delete(`/me/notifications/${notificationId}`);
    }
}