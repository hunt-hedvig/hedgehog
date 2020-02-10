import api from 'api'
import config from 'api/config'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {
  editMemberDetailsSuccess,
  memberRequestError,
  memberRequestSuccess,
} from '../actions/messagesActions'
import { showNotification } from '../actions/notificationsActions'
import {
  ADD_MESSAGE,
  EDIT_MEMBER_DETAILS,
  MEMBER_REQUESTING,
} from '../constants/members'

function* memberRequestFlow({ id }) {
  try {
    const member = yield call(api, config.members.findOne, null, id)
    yield put(memberRequestSuccess(member.data))
  } catch (error) {
    yield [
      put(showNotification({ message: error.message, header: 'Members' })),
      put(memberRequestError(error)),
    ]
  }
}

function* editMemberDetailsFlow({ member }) {
  try {
    const path = `${member.memberId}/edit`
    yield call(api, config.members.edit, member, path)
    yield put(editMemberDetailsSuccess(member))
  } catch (error) {
    yield [
      put(memberRequestError(error)),
      put(showNotification({ message: error.message, header: 'Member' })),
    ]
  }
}

function* messagesWatcher() {
  yield [
    takeEvery(
      ADD_MESSAGE,
      ({ message, forceSendMessage, stompClient, memberId }) => {
        stompClient.send(
          config.ws.send + memberId,
          {},
          JSON.stringify({
            memberId,
            msg: message,
            forceSendMessage,
          }),
        )
      },
    ),
    takeLatest(MEMBER_REQUESTING, memberRequestFlow),
    takeLatest(EDIT_MEMBER_DETAILS, editMemberDetailsFlow),
  ]
}

export default messagesWatcher
