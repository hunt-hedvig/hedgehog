import api from 'api'
import config from 'api/config'
import { history } from 'store'
import { setClient } from '../store/actions/clientActions'
/**
 * Check credentials in app store
 * @param {function} getState
 */
export function checkLocalAuth(getState) {
  const state = getState()
  return !!state.client.id
}

/**
 * Check client credentails in backend
 */
export async function checkApiAuth({ dispatch, getState }) {
  try {
    if (checkLocalAuth(getState)) {
      return true
    }
    const client = await api(config.login.login)
    dispatch(setClient(client.data))
    return true
  } catch (error) {
    history.replace('/login/oauth')
    return false
  }
}
