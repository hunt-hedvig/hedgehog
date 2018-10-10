import initialState from "../initialState";
import { refreshMessagesList } from "lib/helpers";
import {
  MESSAGE_RECEIVED,
  CLEAR_MESSAGES_LIST,
  SET_ACTIVE_CONNECTION,
  MEMBER_REQUESTING,
  MEMBER_REQUEST_SUCCESS,
  EDIT_MEMBER_DETAILS,
  EDIT_MEMBER_DETAILS_SUCCESS
} from "../constants/members";

export default function(state = initialState.messages, action) {
  switch (action.type) {
    case MESSAGE_RECEIVED:
      return {
        ...state,
        list: refreshMessagesList(state.list.slice(), action.message)
      };
    case CLEAR_MESSAGES_LIST:
      return {
        ...state,
        list: []
      };
    case SET_ACTIVE_CONNECTION:
      return {
        ...state,
        activeConnection: action.connection
      };
    case MEMBER_REQUESTING:
      return {
        ...state
      };

    case MEMBER_REQUEST_SUCCESS:
      return {
        ...state,
        member: action.member
      };

    case EDIT_MEMBER_DETAILS:
      return {
        ...state
      };

    case EDIT_MEMBER_DETAILS_SUCCESS:
      return {
        ...state,
        member: action.member
      };

    default:
      return state;
  }
}
