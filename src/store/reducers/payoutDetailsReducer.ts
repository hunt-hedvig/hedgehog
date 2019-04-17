import initialState from 'store/initialState'
import {
  PAYOUT_REQUEST_ERROR,
  PAYOUT_REQUEST_SUCCESS,
  PAYOUT_REQUESTING,
} from '../constants/payout'

export default function(state = initialState.payoutDetails, action) {
  switch (action.type) {
    case PAYOUT_REQUEST_ERROR:
      return {
        ...state,
        error: action.error,
      }
    case PAYOUT_REQUEST_SUCCESS:
      return {
        ...state,
        data: action.data,
      }
    case PAYOUT_REQUESTING:
      return {
        ...state,
        data: action.data,
        memberId: action.memberId,
      }
    default:
      return {
        ...state,
        error: action.error,
      }
  }
}
