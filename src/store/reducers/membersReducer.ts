import initialState from "../initialState";
import {
  setNewMessagesCounter,
  filterMembersList,
  sortMembersList
} from "../../lib/helpers";
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

export default function(state = initialState.members, action) {
  switch (action.type) {
    case MEMBER_SEARCH_REQUESTING:
    case MEMBERS_REQUESTING:
      return {
        ...state,
        requesting: true,
        query: action.query ? action.query.query : state.query
      };

    case MEMBERS_REQUEST_SUCCESS:
    case MEMBERS_SEARCH_SUCCESS:
      return {
        ...state,
        list: sortMembersList(
          filterMembersList(action),
          action.fieldName,
          action.isDescendingOrder
        ),
        requesting: false
      };

    case NEW_MESSAGES_RECEIVED:
      return {
        ...state,
        list: setNewMessagesCounter(state.list.slice(), action.messagesCouters)
      };

    case SET_MEMBER_FILTER:
      return {
        ...state,
        filter: action.query.filter,
        requesting: true
      };

    case MEMBERS_ERROR:
      return {
        ...state,
        requesting: false
      };

    case SORT_MEMBERS_LIST:
      return {
        ...state,
        list: sortMembersList(
          [...state.list],
          action.fieldName,
          action.isReverse
        )
      };

    default:
      return state;
  }
}
