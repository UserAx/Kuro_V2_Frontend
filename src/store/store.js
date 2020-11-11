import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import userReducer from '../reducers/user';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import filterReducer from '../reducers/filter';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const userpersistConfig = {
    key: 'user',
    storage
}

const userpersistReducer = persistReducer(userpersistConfig, userReducer);

export default () => {
    const store = createStore(
        combineReducers({
            user: userpersistReducer,
            filter: filterReducer
        }), composeEnhancer(applyMiddleware(thunk))
    );
    const persistor = persistStore(store);
    return {store, persistor};
};