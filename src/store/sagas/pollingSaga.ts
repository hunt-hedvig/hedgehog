import { take, put, call, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from 'api';
import config from 'api/config';
import { POLL_START, POLL_STOP } from '../constants/assets';
import {
    assetRequestError,
    assetRequestSuccess
} from '../actions/assetsActions';
import { showNotification } from '../actions/notificationsActions';

function* pollAssetsSaga({ duration }) {
    while (true) {
        try {
            const assets = yield call(api, config.asset.get);
            yield put(assetRequestSuccess(assets.data));
            yield call(delay, duration);
        } catch (error) {
            yield [
                put(
                    showNotification({
                        message: error.message,
                        header: 'Assets polling'
                    })
                ),
                put(assetRequestError(error))
            ];
            take(POLL_STOP);
        }
    }
}

function* pollAssetsSagaWatcher() {
    while (true) {
        const actionInfo = yield take(POLL_START);
        yield race([call(pollAssetsSaga, actionInfo), take(POLL_STOP)]);
    }
}

export default pollAssetsSagaWatcher;
