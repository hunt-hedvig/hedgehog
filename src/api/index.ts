import axios, { AxiosResponse } from 'axios'
import { forceLogOut } from '../utils/auth'

const axiosInstance = axios.create({
  baseURL: '/api/',
  timeout: 10000,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

const setItemWithExpiry = (key, value, ttl) =>
  localStorage.setItem(
    key,
    JSON.stringify({
      value,
      expiry: new Date().getTime() + ttl,
    }),
  )

export const getItemWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key)

  if (!itemStr) {
    return null
  }

  const item = JSON.parse(itemStr)

  if (new Date().getTime() > item.expiry) {
    localStorage.removeItem(key)
    return null
  }

  return item.value
}

export const refreshAccessToken = async () => {
  if (getItemWithExpiry('hvg:refreshingAccessToken') === 'true') {
    // bail if we're already refreshing
    return
  }

  try {
    setItemWithExpiry('hvg:refreshingAccessToken', 'true', 10000)
    await axios.post('/login/refresh', null, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      withCredentials: true,
    })
  } finally {
    localStorage.removeItem('hvg:refreshingAccessToken')
  }
}

const callApi = async <T = any>(
  conf: any,
  data: any,
  id: string | number | undefined,
  params: any,
  retryCount = 0,
): Promise<AxiosResponse<T>> => {
  try {
    return await axiosInstance.request<T>({
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
        return null as any
      }

      if (retryCount >= 20) {
        forceLogOut()
        return null as any
      }

      return callApi(conf, data, id, params, retryCount + 1)
    }
    throw new Error(error)
  }
}
export default callApi
