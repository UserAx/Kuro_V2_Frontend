import React from 'react';
import Contact from './ContactComponent';
import { connect } from 'react-redux';
import {startDeleteContact} from '../actions/user';
import LazyLoad from 'react-lazyload';
import filterContactsByText from '../selector/filterContacts';
import {startPostNotification} from '../actions/notification';
import {io} from './Kuro';


const Placeholder = () => (
    <div className="contact__placeholder">
        <div className="contact__placeholder__avatarplaceholder"></div>
        <div className="contact__username"></div>
    </div>
);

export const Contacts = (props) => {
    
    const onhandleRemove = async (id) => {
        try{
            if(confirm("Are you sure you want to delete this person from your contacts?")){
                await props.startDeleteContact(props.token, id);
            }
        }catch(e){
            alert("An error has occured. Please try again.");
            console.log(e);
        }
    }

    const onhandleSendRequest = async (notification) => {
        try{
            await props.startPostNotification(props.token, notification).then((result) => {
                io.emit("sendFriendRequest", result.data, (error) => console.log(error));
            });
        }catch(e){
            alert("Unexpected error. Please try again later.");
            console.log(e);
        }
    }

    return (
        <div className="contacts">
                {props.contacts.map((contact) => {
                    return (
                        <LazyLoad key={contact.id} placeholder={<Placeholder />} >
                            <Contact
                            key={contact.id}
                            onhandleBack={props.onhandleBack}
                            contact={contact}
                            history={props.history}
                            onhandleSendRequest={onhandleSendRequest}
                            onhandleRemove={onhandleRemove}
                            onSearch={props.onSearch && props.onSearch}
                            />
                        </LazyLoad>
                    )
                })}
            </div>
    );
};

const mapStateToProps = (state, props) => {
    if(props.onSearch){
        return;
    }
    return {
        contacts: filterContactsByText(state.user.contacts, state.filter.text),
    }
};

const mapDispatchToProps = (dispatch) => ({
    startDeleteContact: (token, contactId) => dispatch(startDeleteContact(token, contactId)),
    startPostNotification: (token, notification) => dispatch(startPostNotification(token, notification))
});

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
