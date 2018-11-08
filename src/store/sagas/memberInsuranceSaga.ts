import api from 'api'
import config from 'api/config'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import {
  MEMBER_INS_SEARCH_REQUESTING,
  SET_MEMBER_INS_FILTER,
} from '../constants/memberInsurance'

import { AxiosResponse } from 'axios'
import {
  memberInsRequestError,
  SearchMemberInsRequestAction,
  searchMemberInsSuccess,
} from '../actions/memberInsuranceActions'
import { showNotification } from '../actions/notificationsActions'
import { BackofficeStore } from '../storeTypes'
import { MemberInsuranceSearchResult } from '../types/memberInsuranceTypes'

function* searchFlow(action: SearchMemberInsRequestAction) {
  const state: BackofficeStore = yield select()
  try {
    const searchResult: AxiosResponse<MemberInsuranceSearchResult> = yield call(
      api,
      config.insMembers.searchPaged,
      null,
      '',
      {
        ...state.memberInsurance.searchFilter,
        ...action.searchFilter,
      },
    )
    yield put(searchMemberInsSuccess(searchResult.data))
  } catch (error) {
    yield [
      put(memberInsRequestError(error)),
      put(showNotification({ message: error.message, header: 'Members' })),
    ]
  }
}

function* membersInsuranceWatcher() {
  yield [
    takeLatest(MEMBER_INS_SEARCH_REQUESTING, searchFlow),
    takeLatest(SET_MEMBER_INS_FILTER, searchFlow),
  ]
}

export default membersInsuranceWatcher
