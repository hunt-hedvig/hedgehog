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

export default async (conf, data, id, params) => {
  try {
    return await axiosInstance.request({
      url: `${conf.url}${id ? '/' + id : ''}`,
      method: conf.method,
      data,
      params,
    })
  } catch (error) {
    if (error.response.status === 403) {
      history.replace('/login/oauth')
      return
    }
    throw new Error(error)
  }
}
