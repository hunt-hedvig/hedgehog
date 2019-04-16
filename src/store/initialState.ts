import { BackofficeStore } from './storeTypes'

const initialState: BackofficeStore = {
  login: {
    requesting: false,
  },
  assets: {
    list: [],
    requesting: false,
  },
  client: {},
  poll: {
    polling: false,
  },
  messages: {
    list: [],
    activeConnection: null,
    member: null,
  },
  members: {
    list: [],
    searchResult: {
      members: [],
      page: 0,
      totalPages: 1,
    },
    requesting: false,
    searchFilter: {
      status: undefined,
      query: '',
      sortBy: 'CREATED',
      sortDirection: 'DESC',
      page: 0,
      pageSize: 25,
    },
  },
  dashboard: {
    data: null,
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
  },
  questions: {
    answered: {
      questions: [],
      requesting: false,
    },
    notAnswered: {
      questions: [],
      requesting: false,
    },
    requesting: false,
  },
  insurance: {
    requesting: false,
    data: null,
    list: [],
    error: [],
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
