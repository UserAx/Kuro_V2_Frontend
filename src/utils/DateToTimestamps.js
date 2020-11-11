import moment from 'moment';

export const formatDate = (date) => {
    const datum = date.split('-');
    const day = datum[2].substring(0, 2);
    const formatedDate =  day + `/${datum[1]}` + `/${datum[0]}`;
    return formatedDate;
};
