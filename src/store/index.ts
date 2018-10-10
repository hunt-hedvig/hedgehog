/* eslint-env browser */
/* global Raven, process*/
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import { reducer as reduxFormReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import reducers from './reducers';

export const history = createBrowserHistory();

const rootReducer = combineReducers({
    ...reducers,
    form: reduxFormReducer,
    routing: routerReducer
});

const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware({
        onError: e => {
            if (window.Raven && process.env.NODE_ENV === 'production') {
                Raven.captureException(e);
            }
        }
    });
    const router = routerMiddleware(history);
    return {
        ...createStore(rootReducer, applyMiddleware(sagaMiddleware, router)),
        runSaga: sagaMiddleware.run(rootSaga)
    };
};

export default {
    configureStore
};
