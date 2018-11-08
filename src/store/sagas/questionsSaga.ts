import api from 'api'
import config from 'api/config'
import { call, put, takeLatest } from 'redux-saga/effects'
import { showNotification } from '../actions/notificationsActions'
import {
  answerError,
  answerSuccess,
  questionsReqError,
  questionsReqSuccess,
} from '../actions/questionsActions'
import {
  QUESTION_ANSWERING,
  QUESTION_DONE_MSG,
  QUESTIONS_REQUESTING,
} from '../constants/questions'

function* requestFlow(action) {
  try {
    const endpoint =
      action.listType === 'ANSWERED'
        ? config.questions.answered
        : config.questions.notAnsewred

    const questions = yield call(api, endpoint)
    yield put(questionsReqSuccess(questions.data, action.listType))
  } catch (error) {
    yield [
      put(
        showNotification({
          message: error.message,
          header: 'Questions',
        }),
      ),
      put(questionsReqError(error)),
    ]
  }
}

function* sendAnswerFlow({ data }) {
  try {
    yield call(api, config.questions.sendAnswer, data, data.id)
    yield put(answerSuccess(data))
  } catch (error) {
    yield [
      put(
        showNotification({
          message: error.message,
          header: 'Questions',
        }),
      ),
      put(answerError({ message: error.message, memberId: data.id })),
    ]
  }
}

function* sendDoneMsgFlow({ data }) {
  try {
    yield call(api, config.questions.sendDoneMsg, data, data.id)
    yield put(answerSuccess(data))
  } catch (error) {
    yield [
      put(
        showNotification({
          message: error.message,
          header: 'Questions',
        }),
      ),
      put(answerError({ message: error.message, memberId: data.id })),
    ]
  }
}

function* watcher() {
  yield [
    takeLatest(QUESTIONS_REQUESTING, requestFlow),
    takeLatest(QUESTION_ANSWERING, sendAnswerFlow),
    takeLatest(QUESTION_DONE_MSG, sendDoneMsgFlow),
  ]
}

export default watcher
