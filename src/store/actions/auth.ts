import { Action, AnyAction } from 'redux'
import {
  AUTH_CHECK,
  AUTH_FAILURE,
  AUTH_LOG_OUT,
  AUTH_SUCCESS,
} from 'store/constants/auth'

export const authFailure = (): Action => ({ type: AUTH_FAILURE })
export const authSuccess = (payload): AnyAction => ({
  type: AUTH_SUCCESS,
  payload,
})
export const authCheck = (): Action => ({ type: AUTH_CHECK })
export const authLogOut = (): Action => ({ type: AUTH_LOG_OUT })

export enum AuthState {
  UNKNOWN,
  UNAUTHENTICATED,
  AUTHENTICATED,
  LOGOUT_LOADING,
}
