import api from 'api'
import config from 'api/config'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import * as actions from '../actions/claimDetailsActions'
import { showNotification } from '../actions/notificationsActions'
import { CLAIM_DETAILS_UPDATING, CLAIM_REQUESTING } from '../constants/claims'

function* requestFlow({ id }) {
  try {
    const claim = yield call(api, config.claims.getList, null, id)
    yield put(actions.claimRequestSuccess(claim))
  } catch (error) {
    yield [
      put(showNotification({ message: error.message, header: 'Claims' })),
      put(actions.claimRequestError(error)),
    ]
  }
}

function* detailsUpdate(id, data) {
  try {
    const path = `${id}/data`
    yield call(api, config.claims.updateDetails, { ...data }, path)
    return data
  } catch (error) {
    yield [
      put(showNotification({ message: error.message, header: 'Claims' })),
      put(actions.claimRequestError(error)),
    ]
  }
}

function* detailsUpdateFlow({ data, id }) {
  const fieldsList = [...data.optionalData, ...data.requiredData]
  const results = yield all(
    fieldsList.map((item) => call(detailsUpdate, id, item)),
  )
  yield put(actions.claimDetailsUpdateSuccess(results))
}

function* watcher() {
  yield [
    takeLatest(CLAIM_REQUESTING, requestFlow),
    takeLatest(CLAIM_DETAILS_UPDATING, detailsUpdateFlow),
  ]
}

export default watcher
