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
  members: {
    list: [],
    searchResult: {
      items: [],
      page: 0,
      totalPages: 1,
    },
    requesting: false,
    searchFilter: {
      status: undefined,
      query: '',
      sortBy: 'SIGN_UP',
      sortDirection: 'DESC',
      page: 0,
      pageSize: 25,
    },
  },
  claims: {
    searchFilter: {
      page: 0,
      pageSize: 20,
      sortBy: 'DATE',
      sortDirection: 'DESC',
    },
    searchResult: {
      claims: [],
      page: 0,
      totalPages: 1,
    },
    requesting: false,
    types: [],
    memberClaims: [],
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
