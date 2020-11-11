import React from 'react';

export default (AvatarComponent, ButtonComponent) => {
    return (props) => (
        <div className="header">
            <button className="avatar__redirector" onClick={() => props.history.push('/me')}>
                <AvatarComponent 
                displaySmall={false}
                userId={props.userId} 
                username={props.username}
                />
            </button>
            {props.onSettings ? (
                <ButtonComponent 
                onhandleLogoutAll={props.onhandleLogoutAll} 
                onhandleRemoveAccount={props.onhandleRemoveAccount}
                history={props.history}/>
            ) : (
                <ButtonComponent onhandleLogout={props.onhandleLogout} history={props.history}/>
            )}
        </div>
    )
}