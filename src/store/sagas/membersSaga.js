import api from 'api'
import config from 'api/config'
import { call, put, takeLatest } from 'redux-saga/effects'
import {
  membersRequestError,
  membersRequestSuccess,
  saveFraudulentStatusSuccess,
  searchMembersSuccess,
} from '../actions/membersActions'
import { showNotification } from '../actions/notificationsActions'
import {
  MEMBER_SEARCH_REQUESTING,
  MEMBERS_REQUESTING,
  SET_FRAUDULENT_STATUS,
  SET_MEMBER_FILTER,
} from '../constants/members'

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

function* membersSearchFlow(action) {
  const queryFilter = action.searchFilter
  try {
    const searchResult = yield call(api, config.members.search, null, '', {
      query: '',
      pageSize: 25,
      page: 0,
      includeAll: false,
      sortBy: 'SIGN_UP',
      sortDirection: 'DESC',
      ...queryFilter,
    })
    yield put(
      searchMembersSuccess(searchResult.data, fieldName, isDescendingOrder),
    )
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
    takeLatest(SET_MEMBER_FILTER, membersSearchFlow),
    takeLatest(MEMBER_SEARCH_REQUESTING, membersSearchFlow),
    takeLatest(SET_FRAUDULENT_STATUS, saveFraudulentStatusFlow),
  ]
}

export default membersWatcher
