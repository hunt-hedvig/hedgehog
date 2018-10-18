import { sortMemberInsList } from 'lib/helpers'
import {
  MEMBER_INS_ERROR,
  MEMBER_INS_REQUESTING,
  MEMBER_INS_SEARCH_REQUESTING,
  MEMBER_INS_SEARCH_SUCCESS,
  MEMBER_INS_SUCCESS,
  SET_MEMBER_INS_FILTER,
  SORT_MEMBER_INS_LIST,
} from '../constants/memberInsurance'
import initialState from '../initialState'

export default function(state = initialState.memberInsurance, action) {
  switch (action.type) {
    case MEMBER_INS_REQUESTING:
    case MEMBER_INS_SEARCH_REQUESTING:
      return {
        ...state,
        requesting: true,
        query: action.query.query,
      }

    case MEMBER_INS_SUCCESS:
    case MEMBER_INS_SEARCH_SUCCESS:
      return {
        ...state,
        list: sortMemberInsList(
          action.members,
          action.fieldName,
          action.isDescendingOrder,
        ),
        requesting: false,
      }

    case MEMBER_INS_ERROR:
      return {
        ...state,
        requesting: false,
      }

    case SET_MEMBER_INS_FILTER:
      return {
        ...state,
        filter: action.query.filter,
        requesting: true,
      }

    case SORT_MEMBER_INS_LIST:
      return {
        ...state,
        list: sortMemberInsList(
          [...state.list],
          action.fieldName,
          action.isReverse,
        ),
      }
    default:
      return state
  }
}
