import axios from 'axios'
import { history } from '../store'
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

const callApi = async (conf, data, id, params) => {
  try {
    return await axiosInstance.request({
      url: `${conf.url}${id ? '/' + id : ''}`,
      method: conf.method,
      withCredentials: true,
      data,
      params,
    })
  } catch (error) {
    if (error.response && error.response.status === 403) {
      try {
        await axios.post('/login/refresh', null, {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
          withCredentials: true,
        })
      } catch (e) {
        history.push('/login/oauth')
        return
      }

      return callApi(conf, data, id, params)
    }
    throw new Error(error)
  }
}
export default callApi
