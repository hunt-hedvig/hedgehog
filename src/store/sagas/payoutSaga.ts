import api from 'api'
import config from 'api/config'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as actions from '../actions/payoutDetailsActions'
import { PAYOUT_REQUESTING } from '../constants/payout'

function* createPayout({ data }) {
  try {
    const requestBody = {
      amount: {
        amount: data.amount,
        currency: 'SEK',
      },
      category: data.category,
      referenceId: data.referenceId,
    }
    const result = yield call(
      api,
      config.payout.create,
      { ...requestBody },
      data.memberId
    )
    console.log('result', result)
    yield [put(actions.payoutRequestSuccess(data))]
  } catch (error) {
    yield [put(actions.payoutRequestError(error))]
  }
}

function* watcher() {
  yield [takeLatest(PAYOUT_REQUESTING, createPayout)]
}

export default watcher
