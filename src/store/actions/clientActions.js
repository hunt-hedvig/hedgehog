import {CLIENT_SET, CLIENT_UNSET} from '../constants/login'

export const setClient = (creditals) => ({
  type: CLIENT_SET,
  creditals,
})

export const unsetClient = () => ({
  type: CLIENT_UNSET,
})
