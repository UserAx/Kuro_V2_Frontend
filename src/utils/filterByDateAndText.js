import moment from 'moment';

export default (messages) => {
    return messages.sort((a, b) => {
        return moment(a.createdAt).valueOf() < moment(b.createdAt).valueOf() ? 1: -1; 
    });
}
