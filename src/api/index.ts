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
  await axios.post('/login/refresh', null, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    withCredentials: true,
  })
  await axios.post('/api/settings/auth-success', null, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    withCredentials: true,
  })
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
