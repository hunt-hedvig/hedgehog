import { AnyAction, Reducer } from 'redux'
import { AuthState } from 'store/actions/auth'
import { AUTH_CHECK, AUTH_FAILURE, AUTH_SUCCESS } from 'store/constants/auth'
import initialState from 'store/initialState'
import { BackofficeStore } from 'store/storeTypes'

const authReducer: Reducer<BackofficeStore['auth']> = (
  state = initialState.auth,
  action,
) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        state: AuthState.AUTHENTICATED,
        scopes: (action as AnyAction).payload?.scopes ?? [],
        id: (action as AnyAction).payload?.id,
        email: (action as AnyAction).payload?.email,
      }
    case AUTH_FAILURE:
      return {
        loading: false,
        state: AuthState.UNAUTHENTICATED,
        scopes: [],
      }
    case AUTH_CHECK:
    default:
      return state
  }
}

export default authReducer
