import { AuthState } from 'store/actions/auth'
import { BackofficeStore } from './storeTypes'
import { PayoutRequestResult } from './types/payoutTypes'

const initialState: BackofficeStore = {
  auth: {
    state: AuthState.UNKNOWN,
    scopes: [],
  },
  login: {
    requesting: false,
  },
  client: {},
  poll: {
    polling: false,
  },
  claimDetails: {
    data: null,
    notes: [],
    payments: [],
  },
  payoutDetails: {
    data: null,
    requesting: false,
    requestResult: PayoutRequestResult.READY,
  },
  notifications: [],
  memberInsurance: {
    searchFilter: {
      state: undefined,
      query: '',
      page: 0,
      pageSize: 25,
      sortBy: 'CONTRACT_SIGNED_DATE',
      sortDirection: 'DESC',
    },
    searchResult: {
      products: [],
      page: 0,
      totalPages: 1,
    },
    requesting: false,
  },
}

export default initialState
