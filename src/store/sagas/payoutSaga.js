import api from 'api'
import config from 'api/config'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as actions from '../actions/payoutDetailsActions'
import { PAYOUT_REQUESTING } from '../constants/payout'
import { toast } from 'react-hot-toast'

function* createPayout({ data, memberId }) {
  try {
    const requestBody = {
      amount: {
        amount: data.amount,
        currency: 'SEK',
      },
      category: data.category,
      referenceId: data.referenceId,
      note: data.note,
    }

    yield call(api, config.payout.create, { ...requestBody }, memberId)

    yield [
      put(actions.payoutRequestSuccess()),
      put(toast.success('Payout successful')),
    ]
  } catch (error) {
    yield [
      put(actions.payoutRequestError(error)),
      put(toast.error('Payout failed')),
    ]
  }
}

function* watcher() {
  yield [takeLatest(PAYOUT_REQUESTING, createPayout)]
}

export default watcher
