import api from 'api'
import config from 'api/config'
import { call, cancel, cancelled, fork, put, take } from 'redux-saga/effects'
import { history } from 'store'
import { setClient, unsetClient } from '../actions/clientActions'
import { showNotification } from '../actions/notificationsActions'
import {
  CLIENT_UNSET,
  LOGIN_ERROR,
  LOGIN_PROCESS,
  LOGIN_SUCCESS,
} from '../constants/login'

const clearStore = () => {
  unsetClient()
  history.push('/login/oauth')
}

export function* logout() {
  try {
    yield call(api, config.login.logout)
    clearStore()
  } catch (error) {
    clearStore()
  }
}

function* loginFlow() {
  let request
  try {
    request = yield call(api, config.login.login)
    yield [put(setClient(request.data)), put({ type: LOGIN_SUCCESS })]
    history.push('/dashboard')
  } catch (error) {
    yield [
      put(showNotification({ message: error.message, header: 'Login' })),
      put({ type: LOGIN_ERROR, error }),
    ]
  } finally {
    if (yield cancelled()) {
      history.push('/login/oauth')
    }
  }

  return request
}

function* loginWatcher() {
  while (true) {
    yield take(LOGIN_PROCESS)
    const task = yield fork(loginFlow)
    const action = yield take([CLIENT_UNSET, LOGIN_ERROR])
    if (action.type === CLIENT_UNSET) {
      yield cancel(task)
    }
    yield call(logout)
  }
}

export default loginWatcher
