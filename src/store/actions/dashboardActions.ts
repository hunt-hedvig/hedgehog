import {
  DASHBOARD_ERROR_RECEIVED,
  DASHBOARD_UPDATED,
  UPDATES_REQUEST_SUCCESS,
} from '../constants/dashboard'

export const dashboardErrorReceived = (error) => ({
  type: DASHBOARD_ERROR_RECEIVED,
  error,
})

export const updatesRequestSuccess = (status) => ({
  type: UPDATES_REQUEST_SUCCESS,
  status,
})

export const dashboardUpdated = (status) => ({
  type: DASHBOARD_UPDATED,
  status,
})
