import axios from 'axios'
import { forceLogOut } from 'utils/auth'
import config from './config'

const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  timeout: 10000,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const refreshAccessToken = async () => {
  if ((window as any).__hvg_refreshingAccessToken) {
    // bail if we're already refreshing
    return
  }

  try {
    ;(window as any).__hvg_refreshingAccessToken = true
    await axios.post('/login/refresh', null, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      withCredentials: true,
    })
    await axiosInstance.post('/settings/auth-success')
  } finally {
    ;(window as any).__hvg_refreshingAccessToken = false
  }
}

const callApi = async (conf, data, id, params, retryCount = 0) => {
  try {
    return await axiosInstance.request({
      url: `${conf.url}${id ? '/' + id : ''}`,
      method: conf.method,
      withCredentials: true,
      data,
      params,
    })
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      try {
        await refreshAccessToken()
      } catch (e) {
        forceLogOut()
        return
      }

      if (retryCount >= 10) {
        forceLogOut()
        return
      }

      return callApi(conf, data, id, params, retryCount + 1)
    }
    throw new Error(error)
  }
}
export default callApi
