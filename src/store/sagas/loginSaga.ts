import { take, fork, cancel, call, put, cancelled } from 'redux-saga/effects';
import { history } from 'store';
import api from 'api';
import config from 'api/config';
import { setClient, unsetClient } from '../actions/clientActions';
import {
    LOGIN_PROCESS,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    CLIENT_UNSET
} from '../constants/login';
import { showNotification } from '../actions/notificationsActions';

const clearStore = () => {
    unsetClient();
    history.push('/login/oauth');
};

export function* logout() {
    try {
        yield call(api, config.login.logout);
        clearStore();
    } catch (error) {
        clearStore();
    }
}

function* loginFlow() {
    let request;
    try {
        request = yield call(api, config.login.login);
        yield [put(setClient(request.data)), put({ type: LOGIN_SUCCESS })];
        history.push('/dashboard');
    } catch (error) {
        yield [
            put(showNotification({ message: error.message, header: 'Login' })),
            put({ type: LOGIN_ERROR, error })
        ];
    } finally {
        if (yield cancelled()) {
            history.push('/login/oauth');
        }
    }

    return request;
}

function* loginWatcher() {
    while (true) {
        yield take(LOGIN_PROCESS);
        const task = yield fork(loginFlow);
        const action = yield take([CLIENT_UNSET, LOGIN_ERROR]);
        if (action.type === CLIENT_UNSET) {
            yield cancel(task);
        }
        yield call(logout);
    }
}

export default loginWatcher;
