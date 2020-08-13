import api from 'api'
import config from 'api/config'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as actions from '../actions/claimsActions'
import { showNotification } from '../actions/notificationsActions'
import {
  CLAIMS_BY_MEMBER,
  CLAIMS_REQUESTING,
} from '../constants/claims'

function* requestFlow({ searchFilter }) {
  try {
    const { data } = yield call(
      api,
      config.claims.search,
      null,
      null,
      searchFilter,
    )
    yield put(actions.claimsRequestSuccess(data))
  } catch (error) {
    yield [
      put(showNotification({ message: error.message, header: 'Claims' })),
      put(actions.claimsError(error)),
    ]
  }
}

function* requestByMemberFlow({ id }) {
  try {
    const { data } = yield call(api, config.claims.getListByMemberId, null, id)
    yield put(actions.claimsByMemberSuccess(data))
  } catch (error) {
    yield [
      put(showNotification({ message: error.message, header: 'Claims' })),
      put(actions.claimsError(error)),
    ]
  }
}

function* claimsWatcher() {
  yield [
    takeLatest(CLAIMS_REQUESTING, requestFlow),
    takeLatest(CLAIMS_BY_MEMBER, requestByMemberFlow),
  ]
}

export default claimsWatcher
