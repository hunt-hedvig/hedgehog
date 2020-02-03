import api from 'api'
import config from 'api/config'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { authFailure, authSuccess } from 'store/actions/auth'
import { AUTH_CHECK } from 'store/constants/auth'
import { BackofficeStore } from 'store/storeTypes'

function* checkAuth() {
  const response = yield call(api, config.login.login)
  if (response.status === 200) {
    yield put(authSuccess(response.data))
    return
  }

  yield put(authFailure())
}

function* authFlow() {
  yield [takeLatest(AUTH_CHECK, checkAuth)]
}

export default authFlow
