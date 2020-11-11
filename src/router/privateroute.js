import React from 'react';
import {Route, Redirect} from 'react-router-dom';

export default ({
    Authenticated, component: Component, ...rest
}) => (
    <Route {...rest} component = {(props) => Authenticated ? (
        <Component {...props} />
    ) : (<Redirect to='/' />)} />
);