import { Action } from 'redux'
import { AUTH_CHECK, AUTH_FAILURE, AUTH_SUCCESS } from 'store/constants/auth'

export const authFailure = (): Action => ({ type: AUTH_FAILURE })
export const authSuccess = (payload): Action => ({
  type: AUTH_SUCCESS,
  payload,
})
export const authCheck = (): Action => ({ type: AUTH_CHECK })

export enum AuthState {
  UNKNOWN,
  UNAUTHENTICATED,
  AUTHENTICATED,
}
