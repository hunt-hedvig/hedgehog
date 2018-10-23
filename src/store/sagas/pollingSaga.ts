import api from 'api'
import config from 'api/config'
import { delay } from 'redux-saga'
import { call, put, race, take } from 'redux-saga/effects'
import {
  assetRequestError,
  assetRequestSuccess,
} from '../actions/assetsActions'
import { showNotification } from '../actions/notificationsActions'
import { POLL_START, POLL_STOP } from '../constants/assets'

function* pollAssetsSaga({ duration }) {
  while (true) {
    try {
      const assets = yield call(api, config.asset.get)
      yield put(assetRequestSuccess(assets.data))
      yield call(delay, duration)
    } catch (error) {
      yield [
        put(
          showNotification({
            message: error.message,
            header: 'Assets polling',
          }),
        ),
        put(assetRequestError(error)),
      ]
      take(POLL_STOP)
    }
  }
}

function* pollAssetsSagaWatcher() {
  while (true) {
    const actionInfo = yield take(POLL_START)
    yield race([call(pollAssetsSaga, actionInfo), take(POLL_STOP)])
  }
}

export default pollAssetsSagaWatcher
