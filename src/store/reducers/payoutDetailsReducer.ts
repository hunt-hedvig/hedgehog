import initialState from 'store/initialState'
import {
  PAYOUT_REQUEST_ERROR,
  PAYOUT_REQUEST_SUCCESS,
  PAYOUT_REQUESTING,
} from '../constants/payout'
import { PayoutRequestResult } from '../types/payoutTypes'

export default function(state = initialState.payoutDetails, action) {
  switch (action.type) {
    case PAYOUT_REQUEST_ERROR:
      return {
        ...state,
        requestResult: PayoutRequestResult.ERROR,
        requesting: true,
      }
    case PAYOUT_REQUEST_SUCCESS:
      return {
        ...state,
        requestResult: PayoutRequestResult.SUCCESS,
        requesting: false,
      }
    case PAYOUT_REQUESTING:
      return {
        ...state,
        data: action.data,
        memberId: action.memberId,
        requestResult: PayoutRequestResult.READY,
        requesting: false,
      }
    default:
      return {
        ...state,
      }
  }
}
