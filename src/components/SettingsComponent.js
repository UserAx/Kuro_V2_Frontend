import React, { useState } from 'react';
import Avatar from './AvatarComponent';
import { connect } from 'react-redux';
import { Details } from './DetailsComponent';
import { startEditUser, startLogoutAllUser, startDeleteUser, startAddAvatar } from '../actions/user';
import generateHeader from './HeaderComponent';
import fileExtensionExtractor from '../utils/fileExtensionExtractor'; 

const buttonComponent = (props) => {
    return (
        <div className="kuro__header__buttoncomponent">
            <button onClick={props.onhandleLogoutAll} className="app__logo__button">
                <img className="app__buttonlogo" src="/images/logout.png" />
            </button>
            <button onClick={props.onhandleRemoveAccount}
                className="app__logo__button">
                <img className="app__buttonlogo" src="/images/removeaccount.png" />
            </button>
        </div>
    )
}

const Header = generateHeader(Avatar, buttonComponent);

const SettingsComponent = (props) => {

    const [error, setError] = useState(undefined);
    const [showSaveAvatarButton, setShowSaveAvatarButton] = useState(undefined);

    const onSave = async (user) => {
        try {
            if(user.phone.length !== 10){
                alert("Phone Number must be a 10 digit number. Your number will not be updated until you provide a valid number");
            }
            await props.startEditUser(props.token, user);
            setError(undefined);
        } catch (e) {
            if(e.response.data.error){
                setError(e.response.data.error);
            }
            if (e.response.data && e.response.data.code === 11000) {
                setError(`${Object.keys(e.response.data.keyPattern)} in use.`);
            }
            console.log(e);
        }
    }

    const onhandleLogoutAll = async () => {
        try{
            if(confirm("Are you sure you want to logout from all active devices?")){
                await props.startLogoutAllUser(props.user.token).then(() => props.history.push('/'));
            }
            setError(undefined);
        }catch(e){
            setError("Unable to logout. Please try again.");
            console.log(e);            
        }
    }

    const onhandleRemoveAccount = async () => {
        try{
            if(confirm("Are you sure you want to remove your account? You can't undo this.")){
                await props.startDeleteUser(props.user.token).then(() => props.history.push('/'));
            }
            setError(undefined);
        }catch(e){
            setError("Unable to delete account. Please try again.");
            console.log(e);
        }
    }

    const grabAvatarComponent = () => {
        if(props.user.hasAvatar){
            return document.querySelector('.profileavatar__image');
        }
        return document.querySelector('.profileavatar__initials');
    }

    const onAvatarChange = (e) => {
        const avatar = grabAvatarComponent();
        const fileExtension = fileExtensionExtractor(e.target.files[0].name);
        if(!fileExtension.match(/(jpg|jpeg|png)/)){
            setError("Only png, jpg and jpeg image files are supported.");
            return;
        }
        if(!props.user.hasAvatar){
            avatar.style.display="none";
            const hiddenImageTag = document.querySelector('.profileavatar__image');
            hiddenImageTag.src = URL.createObjectURL(e.target.files[0]);
            hiddenImageTag.style.display = "inline-block";
        }else{
            avatar.src = URL.createObjectURL(e.target.files[0]);
        }
        setShowSaveAvatarButton(true);
    };

    const handleAvatarUpload = () => {
        const newAvatarUpload = document.getElementById('settings__avatar__input');
        newAvatarUpload.click();
    }

    const onSaveAvatar = async () => {
        const newAvatar = document.getElementById('settings__avatar__input');
        if(!newAvatar.files && !newAvatar.files[0]){
            setError("Please upload a image file.");
        }
        try{
            await props.startAddAvatar(props.token, newAvatar.files[0]);
            setError(undefined);
        }catch(e){
            console.log(e);
            setError("Unknown error. Please try again later.");
        }
        setShowSaveAvatarButton(undefined);
    }

    return (
        <div className="settings">
            <Header
            onSettings={true}
            history={props.history}
            username={props.user.username}
            userId={props.user._id}
            onhandleLogoutAll={onhandleLogoutAll}
            onhandleRemoveAccount={onhandleRemoveAccount}
            />
            <div className="settings__avatar__change">
                <input 
                id="settings__avatar__input"
                value={undefined}
                onChange={onAvatarChange}
                type="file" accept="image/png, image/jpg, image/jpeg"/>
                {
                    showSaveAvatarButton ? 
                    (
                        <button 
                        className="settings__avatar__change__button"
                        onClick={onSaveAvatar}>Save Avatar</button>
                    ) : (
                            <button 
                            className="settings__avatar__change__button"
                            onClick={handleAvatarUpload}>Change Avatar</button>
                    )
                }
            </div>
            <span className="error error--settings">{error}</span>
            <Details user={props.user} me={true} onSave={onSave}/>
        </div>
    );
}

const mapStateToProps = (state) => ({
    user: state.user,
    token: state.user && state.user.token
});

const mapDispatchToProps = (dispatch) => ({
    startEditUser: (token, patches) => dispatch(startEditUser(token, patches)),
    startLogoutAllUser: (token) => dispatch(startLogoutAllUser(token)),
    startDeleteUser: (token) => dispatch(startDeleteUser(token)),
    startAddAvatar: (token, avatar) => dispatch(startAddAvatar(token, avatar))
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsComponent);