import api from 'api'
import config from 'api/config'
import { call, put, takeLatest } from 'redux-saga/effects'
import { authFailure, authSuccess } from 'store/actions/auth'
import { AUTH_CHECK, AUTH_LOG_OUT } from 'store/constants/auth'

function* checkAuth() {
  const response = yield call(api, config.login.login)
  if (response.status === 200) {
    yield put(authSuccess(response.data))
    return
  }

  yield put(authFailure())
  window.location.pathname = '/login/logout'
}

function* logOut() {
  window.location.pathname = '/login/logout'
}

function* authFlow() {
  yield [takeLatest(AUTH_CHECK, checkAuth)]
  yield [takeLatest(AUTH_LOG_OUT, logOut)]
}

export default authFlow
