import api from 'api'
import config from 'api/config'
import { call, put, takeLatest } from 'redux-saga/effects'
import {
  membersRequestError,
  membersRequestSuccess,
  saveFraudulentStatusSuccess,
} from '../actions/membersActions'
import { showNotification } from '../actions/notificationsActions'
import { MEMBERS_REQUESTING, SET_FRAUDULENT_STATUS } from '../constants/members'

const fieldName = 'createdOn'
const isDescendingOrder = true

function* membersRequestFlow() {
  try {
    const members = yield call(api, config.members.get)
    yield put(membersRequestSuccess(members.data, fieldName, isDescendingOrder))
  } catch (error) {
    yield [
      put(membersRequestError(error)),
      put(showNotification({ message: error.message, header: 'Members' })),
    ]
  }
}

function* saveFraudulentStatusFlow({
  fraudulentStatus,
  fraudulentStatusDescription,
  memberId,
}) {
  try {
    const path = `${memberId}/setFraudulentStatus`

    yield call(
      api,
      config.members.fraudulentStatus,
      { fraudulentStatus, fraudulentStatusDescription },
      path,
    )

    yield put(saveFraudulentStatusSuccess())
  } catch (error) {
    yield [
      put(
        showNotification({
          message: error.message,
          header: 'Insurance',
        }),
      ),
      put(membersRequestError(error)),
    ]
  }
}

function* membersWatcher() {
  yield [
    takeLatest(MEMBERS_REQUESTING, membersRequestFlow),
    takeLatest(SET_FRAUDULENT_STATUS, saveFraudulentStatusFlow),
  ]
}

export default membersWatcher
