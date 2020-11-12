import React from 'react';

export class Details extends React.Component {
    state = {
        username: this.props.user && this.props.user.username,
        email: (this.props.user && this.props.me) ? this.props.user.email : "Unauthorized",
        password: (this.props.user && this.props.me) ? "You can't view password." : "Unauthorized",
        name: this.props.user.name ? this.props.user.name : 'N/A',
        age: this.props.user.age ? this.props.user.age : 'N/A',
        phone: this.props.user.phone ? this.props.user.phone : 'N/A',
        sex: this.props.user.sex ? this.props.user.sex : undefined,
        editable: false
    }

    handleName = (e) => {
        const name = e.target.value;
        this.setState(({ name }));
    }

    handlePassword = (e) => {
        const password = e.target.value;
        this.setState(({ password }));
    }

    handleAge = (e) => {
        const age = e.target.value;
        if (age.match(/^[0-9]*$/)) {
            this.setState(({ age }));
        }
    }

    handlePhone = (e) => {
        const phone = e.target.value;
        if (phone.match(/^[0-9]*$/)) {
            this.setState(({ phone }));
        }
    }

    handleSex = (e) => {
        const sex = e.target.value;
        this.setState(({ sex }));
    }

    showPassword = () => {
        const password = document.getElementById('userDetails__pass');
        if (password.disabled) {
            password.type = "text";
            password.disabled = false;
        } else if (!password.disabled) {
            password.type = "password";
            password.disabled = true;
        }
    }

    changePassword = () => {
        if(!this.state.password){
            return;
        }
        const user = { password: this.state.password };
        if (confirm(`Are you sure you want to save this as your password: ${user.password}?`)) {
            this.props.onSave(user);
        }
    }

    handleEdit = () => {
        this.setState(({ editable: true }));
    }

    handleSave = () => {
        const user = {
            age: this.state.age,
            sex: this.state.sex,
            phone: this.state.phone,
            name: this.state.name
        }
        if (confirm('Are you sure you want to make these changes?')) {
            this.props.onSave(user);
        }
        this.setState(({ editable: false }));
    }

    render() {
        return (
            <div className="details__container">
                <div className="details">
                    <div className="details__userDetails__detail">
                        <span className="details__labels__label">Username</span>
                        <input className="input__login form__input"
                            type="text"
                            value={this.state.username}
                            disabled={true} />
                    </div>
                    <div className="details__userDetails__detail">
                        <span className="details__labels__label">Email</span>
                        <input className="input__login form__input"
                            type="text"
                            value={this.state.email}
                            disabled={true} />
                    </div>
                    <div className="details__userDetails__detail">
                        <span className="details__labels__label">Password</span>
                        <div>
                            <input className="input__login form__input"
                                type="password"
                                id="userDetails__pass"
                                value={this.state.password}
                                onChange={this.handlePassword}
                                disabled={true} />
                            <div className="chatbox__options">
                                <input type="checkbox" id="chatbox__messagebox__options__checkbox" />
                                <span className="contact__options__dots">...</span>
                                <button
                                    className="chatbox__messagebox__option__button details__password__button"
                                    onClick={this.showPassword}>Show</button>
                                {
                                    this.props.me &&
                                    <button
                                        className="chatbox__messagebox__option__button details__password__button"
                                        onClick={this.changePassword}>Change</button>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="details__userDetails__detail">
                        <span className="details__labels__label">Name</span>
                        <input className="input__login form__input"
                            type="text"
                            value={this.state.name}
                            onChange={this.handleName}
                            disabled={!this.state.editable} />
                    </div>
                    <div className="details__userDetails__detail">
                        <span className="details__labels__label">Age</span>
                        <input className="input__login form__input"
                            type="text"
                            maxLength="2"
                            value={this.state.age}
                            onChange={this.handleAge}
                            disabled={!this.state.editable} />
                    </div>
                    <div className="details__userDetails__detail">
                        <span className="details__labels__label">Sex</span>
                        <select
                            value={this.state.sex} className="input__login form__input"
                            onChange={this.handleSex}
                            disabled={!this.state.editable}>
                            {!this.state.sex && (<option selected>N/A</option>)}
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                    <div className="details__userDetails__detail">
                        <span className="details__labels__label">Phone</span>
                        <input className="input__login form__input"
                            minLength="10"
                            maxLength="10"
                            type="text"
                            value={this.state.phone}
                            onChange={this.handlePhone}
                            disabled={!this.state.editable} />
                    </div>
                </div>
                <div>
                {this.props.me ? (
                    (!this.state.editable ? (
                        <button className="userDetails__button" onClick={this.handleEdit}>Edit</button>
                    ) : (
                        <button className="userDetails__button" onClick={this.handleSave}>Save</button>
                    ))
                ) : (<></>)}
                </div>
            </div>
        );
    }
}