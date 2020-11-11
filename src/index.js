import React from 'react';
import ReactDom from 'react-dom';
import AppRoute from './router/approute';
import configureStore from './store/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {PURGE} from 'redux-persist';
import 'normalize.css/normalize.css';
import './styles/styles.scss';

// import {PURGE} from 'redux-persist';

export const {store, persistor} = configureStore();

const JSX = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <AppRoute />
        </PersistGate>
    </Provider>
);

const renderApp = () => {
    ReactDom.render(<JSX/>, document.getElementById('root'));
}

renderApp();
// store.dispatch({type: PURGE});
