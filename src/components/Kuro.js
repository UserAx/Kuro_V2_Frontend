import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Room from './RoomComponent';
import Contacts from './ContactsComponent';
import { startLogoutUser, startHasAvatar, startFetchContacts, editUserContacts } from '../actions/user';
import Avatar from './AvatarComponent';
import generateHeader from '../components/HeaderComponent';
import SearchBar from './SearchBarComponent';
import socketIoClient from 'socket.io-client';
import Notification from './NotificationsComponet';
import {setCurrentContactId} from '../actions/filter';
import {store} from '../index';
// export const io = socketIoClient("http://localhost:3001");
export const io = socketIoClient();


//Remember to change static url into dynamic by feeding process.env data to webpack.

const buttonComponent = (props) => {
    return (
        <div className="kuro__header__buttoncomponent">
            <button onClick={props.onhandleLogout} className="app__logo__button">
                <img className="app__buttonlogo" src="/images/logout.png" />
            </button>
            <button onClick={() => props.history.push('/me/settings')}
                className="app__logo__button">
                <img className="app__buttonlogo" src="/images/settings.png" />
            </button>
        </div>
    )
}

const Header = generateHeader(Avatar, buttonComponent);

// const AvatarComponent = () => {
//     return (
//             <Avatar userId={props.id} hasAvatar={props.hasAvatar} />
//         <button className=" app__back__button" onClick={onhandleAvatar}>
//             {/* <img className="avatar" src={`http://localhost:3000/users/avatar/${props.id}`}/> */}
//         </button>
//     );
// }

export const Kuro = (props) => {

    const [showBack, setshowBack] = useState(undefined);


    const onhandleBack = () => {
        setshowBack(true);
    }

    const onhandleLogout = async () => {
        try {
            await props.startLogoutUser(props.token);
            props.history.push('/');
        }catch(e){
            alert("An error has occured. Please try again.");
            console.log(e);
        }
    }

    useEffect(() => {
        RefetchContacts();
        if(!showBack){
            store.dispatch(setCurrentContactId(""));
        }
    }, [showBack]);

    useEffect(() => {
        io.emit('join', {username: props.username, _id: props._id}, (error)=>{
            if(error){
                alert(error);
                location.href='/me';
            }
        });
    }, []);

    useEffect(() => {
        RefetchContacts();
    }, []);

    const RefetchContacts = async () => {
        try{
            await props.startFetchContacts(props.token);
        }catch(e){
            console.log(e);
        }
    }

    return (
        <div className="kuro">
            <div className="kuro__options">
                    <Header
                    onSettings={false}
                    history={props.history}
                    username={props.username}
                    userId={props._id}
                    onhandleLogout={onhandleLogout} />
                <Notification/>
                {showBack &&
                    <button onClick={() => setshowBack(undefined)} className=" app__logo__button kuro__home__button__back">
                        <div className="app__button__back">➙</div>
                    </button>
                }
            </div>
            {showBack ? (
                <Room token={props.token} />
            ) : (
                <div className="kuro__home">
                    <SearchBar history={props.history}/>
                    <Contacts
                    history={props.history}
                    token={props.token}
                    onhandleBack={onhandleBack}
                    />
                </div>
            )}
        </div>
    );
}

const mapStateToProps = (state) => ({
    token: state.user && state.user.token,
    hasAvatar: state.user && state.user.hasAvatar,
    username: state.user && state.user.username,
    _id: state.user && state.user._id,
    currentRoomContactId: state.filter.id
});

const mapDispatchToProps = (dispatch) => ({
    startHasAvatar: (id) => dispatch(startHasAvatar(id)),
    startLogoutUser: (token) => dispatch(startLogoutUser(token)),
    startFetchContacts: (token) => dispatch(startFetchContacts(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Kuro);