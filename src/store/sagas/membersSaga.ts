import api from 'api'
import config from 'api/config'
import { call, put, takeLatest } from 'redux-saga/effects'
import {
  membersRequestError,
  membersRequestSuccess,
  saveFraudulentStatusSuccess,
  SearchMemberRequestAction,
  searchMembersSuccess,
} from '../actions/membersActions'
import { showNotification } from '../actions/notificationsActions'
import {
  MEMBER_SEARCH_REQUESTING,
  MEMBERS_REQUESTING,
  SET_FRAUDULENT_STATUS,
  SET_MEMBER_FILTER,
} from '../constants/members'
import { MembersSearchResult } from '../storeTypes'

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

function* membersSearchFlow(action: SearchMemberRequestAction) {
  const queryFilter = action.searchFilter
  try {
    const searchResult: MembersSearchResult = yield call(
      api,
      config.members.search,
      null,
      '',
      queryFilter,
    )
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

    const response = yield call(
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
