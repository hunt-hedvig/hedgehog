import {
  MEMBERS_REQUESTING,
  MEMBERS_REQUEST_SUCCESS,
  MEMBERS_ERROR,
  MEMBER_SEARCH_REQUESTING,
  NEW_MESSAGES_RECEIVED,
  SET_MEMBER_FILTER,
  MEMBERS_SEARCH_SUCCESS,
  SORT_MEMBERS_LIST
} from "../constants/members";

export const membersRequest = client => ({
  type: MEMBERS_REQUESTING,
  client
});

export const membersRequestSuccess = (
  members,
  fieldName,
  isDescendingOrder
) => ({
  type: MEMBERS_REQUEST_SUCCESS,
  members,
  fieldName,
  isDescendingOrder
});

export const membersRequestError = error => ({
  type: MEMBERS_ERROR,
  error
});

export const searchMemberRequest = query => ({
  type: MEMBER_SEARCH_REQUESTING,
  query
});

export const searchMembersSuccess = (
  members,
  fieldName,
  isDescendingOrder
) => ({
  type: MEMBERS_SEARCH_SUCCESS,
  members,
  fieldName,
  isDescendingOrder
});

export const newMessagesReceived = messagesCounters => ({
  type: NEW_MESSAGES_RECEIVED,
  messagesCounters
});

export const setFilter = query => ({
  type: SET_MEMBER_FILTER,
  query
});

export const sortMembersList = (fieldName, isReverse) => ({
  type: SORT_MEMBERS_LIST,
  fieldName,
  isReverse
});
