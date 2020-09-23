import {
  MEMBERS_ERROR,
  MEMBERS_REQUEST_SUCCESS,
  SET_FRAUDULENT_STATUS_SUCCESS,
} from '../constants/members'

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

export const saveFraudulentStatusSuccess = () => ({
  type: SET_FRAUDULENT_STATUS_SUCCESS,
})
