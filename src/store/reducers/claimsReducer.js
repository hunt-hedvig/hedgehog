import { sortClaimsList } from 'lib/helpers'
import {
  CLAIM_TYPES,
  CLAIM_TYPES_SUCCESS,
  CLAIMS_BY_MEMBER,
  CLAIMS_BY_MEMBER_SUCCESS,
  CLAIMS_ERROR,
  CLAIMS_REQUEST_SUCCESS,
  CLAIMS_REQUESTING,
  SORT_CLAIMS_LIST,
} from '../constants/claims'
import initialState from '../initialState'

export default function(state = initialState.claims, action) {
  switch (action.type) {
    case CLAIMS_REQUESTING:
      return {
        ...state,
        searchFilter: action.searchFilter,
      }
    case CLAIM_TYPES:
    case CLAIMS_BY_MEMBER:
      return {
        ...state,
        requesting: true,
      }

    case CLAIMS_REQUEST_SUCCESS:
      return {
        ...state,
        searchResult: action.searchResult,
        requesting: false,
      }

    case CLAIM_TYPES_SUCCESS:
      return {
        ...state,
        types: action.types
          .map((type, id) => ({
            ...type,
            key: id,
            value: type.name,
            text: type.title,
          }))
          .sort((a, b) => a.value.localeCompare(b.value)),
      }

    case CLAIMS_BY_MEMBER_SUCCESS:
      return {
        ...state,
        memberClaims: action.claims,
        requesting: false,
      }

    case CLAIMS_ERROR:
      return {
        ...state,
        requesting: false,
      }
    case SORT_CLAIMS_LIST:
      return {
        ...state,
        list: sortClaimsList(
          [...state.list],
          action.fieldName,
          action.isReverse,
        ),
      }
    default:
      return state
  }
}