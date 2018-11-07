import {
  MEMBER_INS_ERROR,
  MEMBER_INS_SEARCH_REQUESTING,
  MEMBER_INS_SEARCH_SUCCESS,
  SET_MEMBER_INS_FILTER,
  SORT_MEMBER_INS_LIST,
} from '../constants/memberInsurance'
import {
  MemberInsuranceSearchRequest,
  MemberInsuranceSearchResult,
} from '../types/memberInsuranceTypes'

export interface SearchMemberInsRequestAction {
  type: 'MEMBER_INS_SEARCH_REQUESTING'
  searchFilter: Partial<MemberInsuranceSearchRequest>
}

export interface SearchMemberInsSuccessAction {
  type: 'MEMBER_INS_SEARCH_REQUESTING'
  searchResponse: MemberInsuranceSearchResult
}

export const memberInsRequestError = (error) => ({
  type: MEMBER_INS_ERROR,
  error,
})

export const searchMemberInsRequest = (
  searchFilter: Partial<MemberInsuranceSearchRequest>,
): SearchMemberInsRequestAction => ({
  type: MEMBER_INS_SEARCH_REQUESTING,
  searchFilter,
})

export const searchMemberInsSuccess = (
  searchResult: MemberInsuranceSearchResult,
) => ({
  type: MEMBER_INS_SEARCH_SUCCESS,
  searchResult,
})

export const setMemberInsFilter = (query) => ({
  type: SET_MEMBER_INS_FILTER,
  query,
})

export const sortMemberInsList = (fieldName, isReverse) => ({
  type: SORT_MEMBER_INS_LIST,
  fieldName,
  isReverse,
})
