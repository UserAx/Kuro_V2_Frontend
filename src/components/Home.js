import React, { useState } from 'react';
import Login from './LoginComponent';
import SignUp from './SignUpComponent';

export default (props) => {
    
    const [showBack, setshowBack] = useState(undefined);

    return (
        <div className="home">
            <div className="home__container">
                    {/* <div className="home__header"> */}
                    {/* </div> */}
                        {showBack ? (
                            <button onClick={() => setshowBack(false)} className="app__button">
                                <div className="app__button__back">➙</div>
                                {/* <img className="app__button__back" src="/images/back.jpg" /> */}
                            </button>
                        ) : (
                            <></>
                        )}
                        <div className="app__logo__container">
                            <span className="app__logo">K</span>
                        </div>
                    {showBack ? (
                        <SignUp history={props.history} />
                    ) : (
                        <div className="home__login">
                            <Login history={props.history}/>
                            <span>
                                Don't have an account? Sign Up 
                            <button onClick ={() => setshowBack(true)} className="button__redirect__signup">Here.</button>
                            </span>
                        </div>

                    )}
                </div>
            </div>
    );
}