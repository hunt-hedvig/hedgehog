import {
  MEMBER_SEARCH_REQUESTING,
  MEMBERS_ERROR,
  MEMBERS_REQUEST_SUCCESS,
  MEMBERS_REQUESTING,
  MEMBERS_SEARCH_SUCCESS,
  NEW_MESSAGES_RECEIVED,
  SET_MEMBER_FILTER,
  SORT_MEMBERS_LIST,
} from '../constants/members'
import { MemberSearchFilter, MembersSearchResult } from '../storeTypes'

export interface SearchMemberRequestAction {
  type: 'MEMBER_SEARCH_REQUESTING'
  searchFilter: MemberSearchFilter
}

export const membersRequest = (client) => ({
  type: MEMBERS_REQUESTING,
  client,
})

export const membersRequestSuccess = (
  members,
  fieldName,
  isDescendingOrder,
) => ({
  type: MEMBERS_REQUEST_SUCCESS,
  members,
  fieldName,
  isDescendingOrder,
})

export const membersRequestError = (error) => ({
  type: MEMBERS_ERROR,
  error,
})

export const searchMemberRequest = (
  searchFilter: MemberSearchFilter,
): SearchMemberRequestAction => ({
  type: MEMBER_SEARCH_REQUESTING,
  searchFilter,
})

export const searchMembersSuccess = (searchResult: MembersSearchResult) => ({
  type: MEMBERS_SEARCH_SUCCESS,
  searchResult,
})

export const newMessagesReceived = (messagesCounters) => ({
  type: NEW_MESSAGES_RECEIVED,
  messagesCounters,
})

export const setFilter = (query: MemberSearchFilter) => ({
  type: SET_MEMBER_FILTER,
  query,
})

export const sortMembersList = (fieldName, isReverse) => ({
  type: SORT_MEMBERS_LIST,
  fieldName,
  isReverse,
})