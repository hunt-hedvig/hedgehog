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

const makeLoginRequestWithRetryAttempt = async (loginConfig: any) => {
  try {
    return await api(loginConfig)
  } catch (e) {
    const isNetworkError = (e.message as string).includes('Network Error')
    if (process.env.NODE_ENV !== 'development' || !isNetworkError) {
      throw e
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    return api(config.login.login)
  }
}

/**
 * Check client credentails in backend
 */
export async function checkApiAuth({ dispatch, getState }) {
  try {
    if (checkLocalAuth(getState)) {
      return true
    }

    const client = await makeLoginRequestWithRetryAttempt(config.login.login)
    dispatch(setClient(client.data))
    return true
  } catch (error) {
    history.replace('/login/oauth')
    return false
  }
}
