import React, { useEffect, useState } from 'react';
import {startFetchContactDetails} from '../actions/user';
import {Details} from './DetailsComponent';
import {connect} from 'react-redux';
import Avatar from './AvatarComponent';

const ContactDetails = (props) => {

    const [contactDetails, setContactDetails] = useState({});

    const [error, setError] = useState(undefined);

    const [mount, setMount] = useState(undefined);

    const fetchcontactDetails = async () => {
        try{
            await props.startFetchContactDetails(props.token, props.contact.id).then((result) => {
                setContactDetails(result.data);
            }); 
            setMount(true);
        }catch(e){
            console.log(e);
            if(e.response){
                setError(e.response.data);
            }
        }
    };

    useEffect(() => {
        fetchcontactDetails();
    }, []);

    return (
        <div className="contactdetails">
            {error ? (
                <span className="error">{error}</span>
            ) : (
                contactDetails.username &&
                    <div className="contactdetails__container">
                        <button onClick={() => props.history.push('/')} 
                        className=" app__logo__button kuro__home__button__back contactdetails__back__button">
                            <div className="app__button__back">➙</div>
                        </button>
                        <div className="contactdetails__details">
                            <Avatar 
                            displaySmall={false} 
                            userId={props.contact.id}
                            username={props.contact.username}
                            />
                            <Details me={false} user={contactDetails} />
                        </div>
                    </div>
            )}
        </div>
    );
}

const mapStateToProps = (state, props) => ({
    contact: state.user.contacts.find((contact) => props.match.params.idValue === contact._id),
    token: state.user.token
});

const mapDispatchToProps = (dispatch) => ({
    startFetchContactDetails: (token, contactId) => dispatch(startFetchContactDetails(token, contactId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetails);