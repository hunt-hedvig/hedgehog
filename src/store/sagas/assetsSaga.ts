import api from 'api'
import config from 'api/config'
import { call, put, take, takeLatest } from 'redux-saga/effects'
import {
  assetRequestError,
  assetRequestSuccess,
  assetUpdateSuccess,
} from '../actions/assetsActions'
import { showNotification } from '../actions/notificationsActions'
import { ASSET_REQUESTING, ASSET_UPDATING } from '../constants/assets'
import { CLIENT_UNSET } from '../constants/login'
import { logout } from './loginSaga'

function* assetUpdateFlow({ assetId, assetState }) {
  try {
    const { data } = yield call(
      api,
      config.asset.update,
      { state: assetState },
      assetId,
    )
    yield put(assetUpdateSuccess(data))
  } catch (error) {
    yield [
      put(assetRequestError(error)),
      put(showNotification({ message: error.message, header: 'Assets' })),
    ]
  }
}

function* assetRequestFlow() {
  try {
    const { data } = yield call(api, config.asset.get)
    yield put(assetRequestSuccess(data))
  } catch (error) {
    yield [
      put(assetRequestError(error)),
      put(showNotification({ message: error.message, header: 'Assets' })),
    ]
  }
}

function* assetsWatcher() {
  yield [
    takeLatest(ASSET_UPDATING, assetUpdateFlow),
    takeLatest(ASSET_REQUESTING, assetRequestFlow),
  ]
  const action = yield take(CLIENT_UNSET)
  if (action.type === CLIENT_UNSET) {
    yield call(logout)
  }
}

export default assetsWatcher
