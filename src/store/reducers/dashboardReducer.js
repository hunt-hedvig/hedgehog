import {
  DASHBOARD_UPDATED,
  UPDATES_REQUEST_SUCCESS,
} from '../constants/dashboard'
import initialState from '../initialState'

export default function(state = initialState.dashboard, action) {
  switch (action.type) {
    case DASHBOARD_UPDATED:
      return {
        data: { ...state.data, ...action.status },
      }
    case UPDATES_REQUEST_SUCCESS:
      return {
        data: { ...state.data, ...action.status },
      }

    default:
      return state
  }
}
