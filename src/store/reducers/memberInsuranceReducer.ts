import { sortMemberInsList } from 'lib/helpers'
import {
  MEMBER_INS_ERROR,
  MEMBER_INS_SEARCH_REQUESTING,
  MEMBER_INS_SEARCH_SUCCESS,
  SET_MEMBER_INS_FILTER,
  SORT_MEMBER_INS_LIST,
} from '../constants/memberInsurance'
import initialState from '../initialState'

export default function(state = initialState.memberInsurance, action) {
  switch (action.type) {
    case MEMBER_INS_SEARCH_REQUESTING:
      return {
        ...state,
        requesting: true,
        searchFilter: {
          ...state.searchFilter,
          ...action.searchFilter,
        },
      }

    case MEMBER_INS_SEARCH_SUCCESS:
      return {
        ...state,
        searchResult: action.searchResult,
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
