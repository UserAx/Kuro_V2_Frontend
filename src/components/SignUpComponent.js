import React, {useState} from 'react';
import {connect} from 'react-redux';
import {startSignUpUser} from '../actions/user';

const SignUp = (props) => {
    
    const [error, setError] = useState(undefined);

    const onSubmit = async (e) => {
        e.preventDefault();
        const $form = document.querySelector('form.signup__form');
        const email = $form.querySelectorAll('input')[0].value;
        const username = $form.querySelectorAll('input')[1].value;
        const password = $form.querySelectorAll('input')[2].value;
        const repeatPassword = $form.querySelectorAll('input')[3].value;
        const user = {email, username, password};
        if(password !== repeatPassword){
            return setError("Password doesn't match.");
        }
        if(password.length < 8){
            return setError("Password length must be greater than 8.")
        }
        try{
            await props.startSignUpUser(user);
            setError(undefined);
            props.history.push('/me/settings');
        }catch(e){
            if(e.response.data && e.response.data.code === 11000){
                setError(`${Object.keys(e.response.data.keyPattern)} in use.`);
            }
            console.log(e.response);
        }
    }

    return (
        <div className="signup">
            <span className="error">{error}</span>
            <form onSubmit={onSubmit} className="signup__form">
                <input type="text" required className="form__input input__login" placeholder="Email" />
                <input type="text" required className="form__input input__login" placeholder="Username" />
                <input minLength="8" type="password" required className="form__input input__login" placeholder="Password" />
                <input minLength="8" type="password" required className="form__input input__login" placeholder="Retype Password" />
                <button className="button__signup">Sign Up</button>
            </form>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => ({
    startSignUpUser: (user) => dispatch(startSignUpUser(user))
});

export default connect(undefined, mapDispatchToProps)(SignUp);