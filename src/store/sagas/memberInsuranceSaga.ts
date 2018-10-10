import { call, put, takeLatest } from "redux-saga/effects";
import api from "api";
import config from "api/config";
import {
  MEMBER_INS_REQUESTING,
  MEMBER_INS_SEARCH_REQUESTING,
  SET_MEMBER_INS_FILTER
} from "../constants/memberInsurance";

import {
  memberInsRequestSuccess,
  searchMemberInsSuccess,
  memberInsRequestError
} from "../actions/memberInsuranceActions";
import { showNotification } from "../actions/notificationsActions";

const fieldName = "signedOn";
const isDescendingOrder = true;

function* requestFlow() {
  try {
    const members = yield call(api, config.insMembers.get);
    yield put(
      memberInsRequestSuccess(members.data, fieldName, isDescendingOrder)
    );
  } catch (error) {
    yield [
      yield put(memberInsRequestError(error)),
      yield put(
        showNotification({
          mesage: error.message,
          header: "Member insurance"
        })
      )
    ];
  }
}

function* searchFlow({ query }) {
  try {
    const queryParams = {
      query: query.query,
      state: query.filter === "ALL" ? "" : query.filter
    };
    const searchResult = yield call(
      api,
      config.insMembers.get,
      null,
      "",
      queryParams
    );
    yield put(
      searchMemberInsSuccess(searchResult.data, fieldName, isDescendingOrder)
    );
  } catch (error) {
    yield [
      put(memberInsRequestError(error)),
      put(showNotification({ message: error.message, header: "Members" }))
    ];
  }
}

function* membersInsuranceWatcher() {
  yield [
    takeLatest(MEMBER_INS_REQUESTING, requestFlow),
    takeLatest(MEMBER_INS_SEARCH_REQUESTING, searchFlow),
    takeLatest(SET_MEMBER_INS_FILTER, searchFlow)
  ];
}

export default membersInsuranceWatcher;
