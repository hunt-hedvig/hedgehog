import {
  LOGIN_ERROR,
  LOGIN_REQUESTING,
  LOGIN_SUCCESS,
} from '../constants/login'
import initialState from '../initialState'

export default function(state = initialState.login, action) {
  switch (action.type) {
    case LOGIN_REQUESTING:
      return {
        requesting: true,
      }

    case LOGIN_SUCCESS:
      return {
        requesting: false,
      }

    case LOGIN_ERROR:
      return {
        requesting: false,
      }

    default:
      return state
  }
}
