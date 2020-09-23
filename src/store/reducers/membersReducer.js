import { filterMembersList, sortMembersList } from '../../lib/helpers'
import {
  MEMBERS_ERROR,
  MEMBERS_REQUEST_SUCCESS,
  SORT_MEMBERS_LIST,
} from '../constants/members'

export default function(state = {}, action) {
  switch (action.type) {
    case MEMBERS_REQUEST_SUCCESS:
      return {
        ...state,
        list: sortMembersList(
          filterMembersList(action),
          action.fieldName,
          action.isDescendingOrder,
        ),
        requesting: false,
      }

    case MEMBERS_ERROR:
      return {
        ...state,
        requesting: false,
      }

    case SORT_MEMBERS_LIST:
      return {
        ...state,
        list: sortMembersList(
          [...state.list],
          action.fieldName,
          action.isReverse,
        ),
      }

    default:
      return state
  }
}
