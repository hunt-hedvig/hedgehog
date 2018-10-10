import { call, put, takeLatest } from 'redux-saga/effects';
import api from 'api';
import config from 'api/config';
import { CLIENT_CHECK_AUTH } from '../constants/login';
import { setClient, unsetClient } from '../actions/clientActions';

function* reqestFlow() {
    try {
        const { data } = yield call(api, config.login.login);
        yield put(setClient(data));
    } catch (error) {
        yield put(unsetClient());
    }
}

function* clientWatcher() {
    yield [takeLatest(CLIENT_CHECK_AUTH, reqestFlow)];
}

export default clientWatcher;
