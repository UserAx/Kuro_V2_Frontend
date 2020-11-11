import React, {useState} from 'react';
import {startLogInUser} from '../actions/user';
import {connect} from 'react-redux';

const LogIn = (props) => {
    
    const [error, setError] = useState(undefined);

    const onSubmit = async (e) => {
        e.preventDefault();
        const $form = document.querySelector('form');
        const email = $form.querySelectorAll('input')[0].value;
        const password = $form.querySelectorAll('input')[1].value;
        try{
             await props.startLogInUser(email, password);
             if(props.Authenticated){
                 setError(undefined);
                 props.history.push('/me');
             }
        }catch(e){
            setError('Invalid Credentials. Please check your email or password.');
            console.log(e);
        }
    };

    return (
    <div className="login">
            {error && <span className="error">{error}</span>}
            <form className="login__form" onSubmit={onSubmit}>
                <input type="text" required placeholder="Email" className="form__input input__login"/>
                <input type="password" required placeholder="Password" className="form__input input__login"/>
                <button className="button__login">Log In</button>
            </form>
        </div>
    );
} 
    
const mapDispatchToprops = (dispatch) => ({    
    startLogInUser: (email, password) => dispatch(startLogInUser(email, password))
});

const mapStateToProps = (state) => ({
    Authenticated: !!state.user._id
});

export default connect(mapStateToProps, mapDispatchToprops)(LogIn);