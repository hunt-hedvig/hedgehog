import {
  MEMBER_INS_REQUESTING,
  MEMBER_INS_SUCCESS,
  MEMBER_INS_ERROR,
  MEMBER_INS_SEARCH_REQUESTING,
  MEMBER_INS_SEARCH_SUCCESS,
  SET_MEMBER_INS_FILTER,
  SORT_MEMBER_INS_LIST
} from "../constants/memberInsurance";

export const memberInsRequest = client => ({
  type: MEMBER_INS_REQUESTING,
  client
});

export const memberInsRequestSuccess = (
  members,
  fieldName,
  isDescendingOrder
) => ({
  type: MEMBER_INS_SUCCESS,
  members,
  fieldName,
  isDescendingOrder
});

export const memberInsRequestError = error => ({
  type: MEMBER_INS_ERROR,
  error
});

export const searchMemberInsRequest = query => ({
  type: MEMBER_INS_SEARCH_REQUESTING,
  query
});

export const searchMemberInsSuccess = (
  members,
  fieldName,
  isDescendingOrder
) => ({
  type: MEMBER_INS_SEARCH_SUCCESS,
  members,
  fieldName,
  isDescendingOrder
});

export const setMemberInsFilter = query => ({
  type: SET_MEMBER_INS_FILTER,
  query
});

export const sortMemberInsList = (fieldName, isReverse) => ({
  type: SORT_MEMBER_INS_LIST,
  fieldName,
  isReverse
});
