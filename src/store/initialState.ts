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
    list: [],
    requesting: false,
    types: [],
    memberClaims: [],
  },
  claimDetails: {
    data: null,
    notes: [],
    payments: [],
  },
  questions: {
    list: {
      answered: [],
      notAnswered: [],
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
    requesting: false,
    list: [],
    filter: '',
    query: '',
  },
}

export default initialState
