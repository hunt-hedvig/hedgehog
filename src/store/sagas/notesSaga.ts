import api from 'api'
import config from 'api/config'
import { call, put, takeLatest } from 'redux-saga/effects'
import { claimRequestError } from '../actions/claimDetailsActions'
import * as actions from '../actions/notesActions'
import { showNotification } from '../actions/notificationsActions'
import { CREATE_NOTE_REQUESTING } from '../constants/claims'

function* createNoteFlow({ data, id }) {
  try {
    const note = yield call(
      api,
      config.claims.details.create,
      data,
      `${id}/notes`,
    )
    yield put(actions.createNoteSuccess(note.data || data))
  } catch (error) {
    yield [
      put(showNotification({ message: error.message, header: 'Notes' })),
      put(claimRequestError(error)),
    ]
  }
}

function* watcher() {
  yield [takeLatest(CREATE_NOTE_REQUESTING, createNoteFlow)]
}

export default watcher
