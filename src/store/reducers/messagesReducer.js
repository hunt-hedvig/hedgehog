import { refreshMessagesList } from 'lib/helpers'
import {
  CLEAR_MESSAGES_LIST,
  EDIT_MEMBER_DETAILS,
  EDIT_MEMBER_DETAILS_SUCCESS,
  MEMBER_REQUEST_SUCCESS,
  MEMBER_REQUESTING,
  MESSAGE_RECEIVED,
  SET_ACTIVE_CONNECTION,
} from '../constants/members'
import initialState from '../initialState'

export default function(state = initialState.messages, action) {
  switch (action.type) {
    case MESSAGE_RECEIVED:
      console.log('received')
      return {
        ...state,
        list: refreshMessagesList(state.list.slice(), action.message),
      }
    case CLEAR_MESSAGES_LIST:
      console.log('cleared')
      return {
        ...state,
        list: [],
      }
    case SET_ACTIVE_CONNECTION:
      return {
        ...state,
        activeConnection: action.connection,
      }
    case MEMBER_REQUESTING:
      return {
        ...state,
      }

    case MEMBER_REQUEST_SUCCESS:
      return {
        ...state,
        member: action.member,
      }

    case EDIT_MEMBER_DETAILS:
      return {
        ...state,
      }

    case EDIT_MEMBER_DETAILS_SUCCESS:
      return {
        ...state,
        member: action.member,
      }

    default:
      return state
  }
}
