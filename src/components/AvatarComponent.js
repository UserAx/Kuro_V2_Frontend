import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { startHasAvatar } from '../actions/user';

//Pass user._id, and hasAvatar for user and contactId and hasContactAvatar for contact into the component.
//displaySmall, a boolean, for contacts Display.

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
                        <img className="profileavatar__image" src={`http://localhost:3000/users/${props.userId}/avatar`} />
                    ) : (
                                <span className="profileavatar__initials">{props.username.toUpperCase().substring(0, 1)}</span>
                    )
            ) : (
                        (hasAvatar) ? (
                            <img className="profileavatar__image--contact" 
                            id="contactavatar" 
                            src={`http://localhost:3000/users/${props.contactId}/avatar`} />
                        ) : (
                                    <span id="contactavatar" className="profileavatar__initials">{props.username.toUpperCase().substring(0, 1)}</span>
                        )
))};

const mapDispatchToProps = (dispatch) => ({
    startHasAvatar: (id) => dispatch(startHasAvatar(id))
});

export default connect(undefined, mapDispatchToProps)(AvatarComponent);