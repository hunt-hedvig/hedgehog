import api from 'api'
import config from 'api/config'
import { call, put, takeLatest } from 'redux-saga/effects'
import { saveFraudulentStatusSuccess } from '../actions/membersActions'
import { showNotification } from '../actions/notificationsActions'
import { SET_FRAUDULENT_STATUS } from '../constants/members'

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
  yield [takeLatest(SET_FRAUDULENT_STATUS, saveFraudulentStatusFlow)]
}

export default membersWatcher
