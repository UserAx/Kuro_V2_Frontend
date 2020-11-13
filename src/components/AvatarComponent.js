import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { startHasAvatar } from '../actions/user';
import {BASEURL} from '../actions/user';

export const AvatarComponent = (props) => {

    const [hasAvatar, setHasAvatar] = useState(undefined);

    const fetchAvatar = async () => {
        try{
            await props.startHasAvatar(props.contactId || props.userId).then((result) => {
                setHasAvatar(result.data);
            });
        }catch(e){
            setHasAvatar(false);
            console.log(e);
        }
    }

    useEffect(() => {
        fetchAvatar();
        if(props.displaySmall){
            const $contactProfileInitials = document.querySelectorAll('#contactavatar');
            $contactProfileInitials.forEach((initials) => {
                initials.classList.add('profileavatar__initials--contacts__icon');
            });
        }
    }, []);

    return (
        (props.userId) ? (
                    (hasAvatar) ? (
                        <img className="profileavatar__image" src={`${BASEURL}users/${props.userId}/avatar`} />
                    ) : (
                        <div>
                            <img style={{"display" : "none"}} className="profileavatar__image" src={''}/>
                            <span className="profileavatar__initials">{props.username.toUpperCase().substring(0, 1)}</span>
                        </div>
                    )
            ) : (
                        (hasAvatar) ? (
                            <img className="profileavatar__image--contact" 
                            id="contactavatar" 
                            src={`${BASEURL}users/${props.contactId}/avatar`} />
                        ) : (
                                    <span id="contactavatar" className="profileavatar__initials">{props.username.toUpperCase().substring(0, 1)}</span>
                        )
))};

const mapDispatchToProps = (dispatch) => ({
    startHasAvatar: (id) => dispatch(startHasAvatar(id))
});

export default connect(undefined, mapDispatchToProps)(AvatarComponent);