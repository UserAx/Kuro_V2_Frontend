import React, { useEffect } from 'react';
import Avatar from './AvatarComponent';
import {connect} from 'react-redux';
import {setCurrentContactId} from '../actions/filter';
import {startFetchMessageAlert} from '../actions/message';
import {io} from './Kuro';


export const Contact = (props) => {

    const enterRoom = () => {
        props.setCurrentContactId(props.contact.id);
        props.onhandleBack();
    };

    const sendFriendRequest = (e) => {
        alert("Request Sent.");
        props.onhandleSendRequest({requestType: "friend__Request", receiverId: props.contact.id});
        e.target.disabled = true;
    };

    const changeStyleOnMessageAlert = () => {
        const contactTitle = document.getElementById(`${props.contact.id}`);
        contactTitle.style.fontWeight = "600";
    }

    const fetchMessageAlert = async () => {
        try{
            await props.startFetchMessageAlert(props.token, props.contact.id).then((result) => {
                if(!result.data){
                    changeStyleOnMessageAlert();
                }
            });
        }catch(e){
            console.log(e);
        }
    };

    useEffect(() => {
        fetchMessageAlert();
        io.on("messageAlert", (sender) => {
            if(sender.senderId === props.contact.id){
                changeStyleOnMessageAlert();
            }
        });
    }, []);

    return (
            <div className="contact">
                <button className="contact__button__enterroom" onClick={enterRoom}>
                        {/* {(props.hasAvatar) ? (
                            <img className="profile__avatar" src={`http://localhost:3000/users/${props.contact.id}/avatar`} />
                            ) : (
                                <img className="profile__avatar" src="/images/avatar__unavilable.jpg" />
                            )} */}
                        <Avatar 
                        username={props.contact.username} 
                        contactId={props.contact.id} 
                        displaySmall={true} 
                        hasAvatar={props.contact.hasAvatar} />
                </button>
                        <span id={props.contact.id} className="contact__username">{props.contact.username}</span>
                    <div className="contact__options">
                        <input id="contact__options__checkbox" type="checkbox" />
                        <div className="contact__options__dots">
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                        </div>
                        <div className="contact__options__buttons__container">
                            <button className="contact__options__button"
                            disabled={!props.contactPositionId[0]}
                            onClick={() => props.history.push(`/me/contactdetails/id=${(props.contact._id || props.contactPositionId)}`)
                            }>Details</button>
                            {props.contactExists ?
                            (
                                <button className="contact__options__button"
                                onClick={() => props.onhandleRemove(props.contact.id)
                                }>Remove</button>
                            ):
                            (
                                <button className="contact__options__button"
                                onClick={sendFriendRequest}>Add</button>
                            )
                            }
                        </div>
                    </div>
            </div>
    );
}

const mapStateToProps = (state, props) => {
    // const contactExists = state.user.contacts.map((contact) => {
    //     if (contact.id === props.contact.id) {
    //         return true;
    //     }
    // }).filter((contact) => contact !== undefined);
    const contactPositionId = state.user.contacts.map((contact) => {
        if(contact.id === props.contact.id){
            return contact._id;
        }
        return undefined;
    }).filter((_id) => _id !== undefined);

    return {
        token: state.user.token,
        contactPositionId,
        contactExists: (contactPositionId.length <= 0) ? false : true,
    }
};

const mapDispatchToProps = (dispatch) => ({
    setCurrentContactId: (id) => dispatch(setCurrentContactId(id)),
    startFetchMessageAlert: (token, contactId) => dispatch(startFetchMessageAlert(token, contactId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
