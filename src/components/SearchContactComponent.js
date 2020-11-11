import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {startFindContacts} from '../actions/user';
import Contacts from './ContactsComponent';
import Avatar from './AvatarComponent';

export const SearchContact = (props) => {

    const [contacts, setContacts] = useState([]);
    const [error, setError] = useState(undefined);
    
    const fetchContacts = async () => {
        try{
            const findContact = props.searchText.replace(/_/g, ' ');
            await props.startFindContacts(props.token, findContact).then((result) => {
                setContacts(result.data);
                setError(undefined);
            });
        }catch(e){
            if(e.response && e.response.data){
                setError(e.response.data);
            }
            console.log(e);
        }
    }
    
    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <div className="searchpage">
            {error ? (
                <span className="error">{error}</span>
            ) : (
                <div className="searchpage__finds">
                    <button className="avatar__redirector searchpage__avatar" onClick={() => props.history.push("/me")}>
                        <Avatar 
                        username={props.username}
                        displaySmall={false} 
                        userId={props.userId} 
                    />
                    </button>
                    <Contacts
                    contacts={contacts}
                    onSearch={true}
                    history={props.history}
                    token={props.token}/>
                </div>
            )}
        </div>
    );
}

const mapStateToProps = (state, props) => ({
    searchText: props.match.params.findContact,
    token: state.user && state.user.token,
    userId: state.user._id,
    username: state.user.username,
    hasAvatar: state.user.hasAvatar
});

const mapDispatchToProps = (dispatch) => ({
    startFindContacts: (token, findContact) => dispatch(startFindContacts(token, findContact))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchContact);