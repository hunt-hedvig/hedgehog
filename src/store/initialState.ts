import { AuthState } from 'store/actions/auth'
import { BackofficeStore } from './storeTypes'

const initialState: BackofficeStore = {
  auth: {
    state: AuthState.UNKNOWN,
    scopes: [],
  },
}

export default initialState
