import React, {Suspense, lazy} from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import {connect} from 'react-redux';
import Home from '../components/Home';
import Kuro from '../components/Kuro';
import PrivateRoute from './privateroute';
import PublicRoute from './publicroute';
import SearchContact from '../components/SearchContactComponent';
// import Settings from '../components/SettingsComponent';
// import ContactDetails from '../components/ContactDetailsComponent';

const Settings = React.lazy(() => import('../components/SettingsComponent'));
const ContactDetails = React.lazy(() => import('../components/ContactDetailsComponent'));

export const history = createHistory();


export const Placeholder = () => (
    <div className="loading">
    </div>
);

export const AppRoute = (props) => (
    <Router history={history}>
        <Switch>
            <PublicRoute Authenticated={props.Authenticated} component={Home} path="/" exact={true}/>
            <PrivateRoute component={Kuro} Authenticated={props.Authenticated} path="/me" exact={true} />
            <Suspense fallback={<Placeholder />}>
            <PrivateRoute component={SearchContact} Authenticated={props.Authenticated} path="/me/users/find=:findContact" exact={true} />
                <PrivateRoute component={Settings} Authenticated={props.Authenticated} path="/me/settings" exact={true} />
                <PrivateRoute component={ContactDetails} Authenticated={props.Authenticated} path="/me/contactdetails/id=:idValue" exact={true} />
            </Suspense>
        </Switch>
    </Router>
);

const mapStateToProps = (state) => ({
    Authenticated: state.user && !!state.user._id
});

export default connect(mapStateToProps)(AppRoute);