import initialState from 'store/initialState'
import {
  PAYOUT_REQUEST_ERROR,
  PAYOUT_REQUEST_SUCCESS,
  PAYOUT_REQUESTING,
} from '../constants/payout'

export default function(state = initialState.payoutDetails, action) {
  switch (action.type) {
    case PAYOUT_REQUEST_ERROR:
      break
    case PAYOUT_REQUEST_SUCCESS:
      return {
        ...state,
        data: action.data,
      }
    case PAYOUT_REQUESTING:
      return {
        ...state,
        data: action.data,
      }
    default:
      return {
        ...state,
        error: action.error,
      }
  }
}
