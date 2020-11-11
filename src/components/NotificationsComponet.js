import React, { useEffect, useState } from 'react';
import Avatar from './AvatarComponent';
import { startAddContact } from '../actions/user';
import { startFetchNotifications, startRemoveNotification } from '../actions/notification';
import { io } from './Kuro';
import { connect } from 'react-redux';
import filterByDate from '../utils/filterByDateAndText';

export const Notification = (props) => {

    //Notification should have type(friendrequest, etc. sender username and id and receiver's id.
    //for messages, we can just use io.listen for new messages)

    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(undefined);
    
    const fetchNotifications = async () => {
        try {
            await props.startFetchNotifications(props.token).then((result) => {
                setNotifications(result.data);
                setError(undefined);
            });
        } catch (e) {
            setError("Unable to fetch notifications.");
            console.log(e);
        }
    }

    const onhandleAddContact = async (senderId, notificationId) => {
        try {
            await props.startAddContact(props.token, senderId);
            await props.startRemoveNotification(props.token, notificationId).then((result) => {
                const newNotificaitons = notifications.filter((notification) => notification._id !== result.data);
                setNotifications(newNotificaitons);
            });
        } catch (e) {
            alert("Unexpected error has occured. Please try again later!");
        }
    };

    const handleRemoveNotification = async (notificationId) => {
        try {
            await props.startRemoveNotification(props.token, notificationId).then((result) => {
                const newNotifications = notifications.filter((notification) => notification._id !== result.data);
                setNotifications(newNotifications);
            });
        } catch (e) {
            alert("Unexpected error has occured. Please try again later!");
        }
    }

    const getmessageAlertCheckBox = () => {
        return document.getElementById('notification__container__checkbox');
    }

    const getmessageAlertRedDot = () => {
        return document.getElementById('notification__alert__icon__reddot');
    }    

    useEffect(() => {
        fetchNotifications();
    },[]);

    useEffect(() => {
        io.on("request", (request) => {
            setNotifications([...notifications, request]);
        });
    }, []);

    useEffect(() => {
        setNotifications(filterByDate(notifications));
        if(notifications.length > 0){
            const redDot = getmessageAlertRedDot();
            redDot.style.opacity = "1";
            const messageAlertCheckBox = getmessageAlertCheckBox();
            messageAlertCheckBox.addEventListener("change", () => {
                if(messageAlertCheckBox.checked === true){
                    console.log("When clicked");
                    redDot.style.opacity = "0";
                }
            });
        }
    }, [notifications]);

    return (
        <div className="notification__container">
            <input type="checkbox" id="notification__container__checkbox" />
            <div className="notification__container__notification__icons">
                <img className="app__buttonlogo" src="/images/notification--icon.png" />
                <div id="notification__alert__icon__reddot"></div>
            </div>
                {
                    error ? (
                        <span className="error">{error}</span>
                    ) : (
                        <div className="notifications__requests">
                            {notifications.map((notification) => {
                              return (
                                <div key={notification._id} className="notification__request">
                                    <div className="notification__request__info">
                                        <Avatar 
                                        displaySmall={true} 
                                        username={notification.sender}
                                        contactId={notification.senderId} />
                                        <span className="notification__info">{notification.sender} sent you a friend request.</span>
                                    </div>
                                    <div className="notification__request__options">
                                        <button
                                        onClick={(e) => {
                                        e.target.disabled = true;
                                        onhandleAddContact(notification.senderId, notification._id);
                                        }}
                                        className="notification__button">Accept</button>
                                        <button
                                        onClick={() => { handleRemoveNotification(notification._id) }}
                                        className="notification__button">Delete</button>
                                    </div>
                                </div>
                                )   
                            } 
                        )}
                    </div>
                    )}
        </div>
    )
}

const mapStateToProps = (state) => ({
    token: state.user.token,
    contacts: state.user.contacts
});

const mapDispatchToProps = (dispatch) => ({
    startAddContact: (token, contactId) => dispatch(startAddContact(token, contactId)),
    startAddContact: (token, contactId) => dispatch(startAddContact(token, contactId)),
    startFetchNotifications: (token) => dispatch(startFetchNotifications(token)),
    startRemoveNotification: (token, notificationId) => dispatch(startRemoveNotification(token, notificationId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);