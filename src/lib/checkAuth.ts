import { Store } from 'redux'
import { authCheck, AuthState } from 'store/actions/auth'
import { BackofficeStore } from 'store/storeTypes'

export function getAuthState(getState: Store['getState']): AuthState {
  const state = getState<BackofficeStore>()
  return state.auth.state
}

export function getAuthStateOrStartChecking({ dispatch, getState }: Store) {
  const loginState = getAuthState(getState)
  if (loginState === AuthState.UNKNOWN) {
    dispatch(authCheck())
  }
  return loginState
}
