export default {
  baseUrl: '/api/',
  asset: {
    get: {
      method: 'get',
      url: 'assets',
    },
    update: {
      method: 'post',
      url: 'assets',
    },
  },
  login: {
    login: {
      method: 'get',
      url: 'settings/me',
    },
    authSuccess: {
      method: 'post',
      url: 'settings/auth-success',
    },
  },
  members: {
    get: {
      method: 'get',
      url: 'member',
    },
    search: {
      method: 'get',
      url: 'member/search',
    },
    findOne: {
      method: 'get',
      url: 'member',
    },
    edit: {
      method: 'post',
      url: 'member',
    },
    fraudulentStatus: {
      url: 'member',
      method: 'post',
    },
  },
  claims: {
    getList: {
      url: 'claims',
      method: 'get',
    },
    search: {
      url: 'claims/search',
      method: 'get',
    },
    getListByMemberId: {
      url: 'claims/user',
      method: 'get',
    },
    types: {
      url: 'claims/types',
      method: 'get',
    },
    update: {
      url: 'claims',
      method: 'post',
    },
    updateDetails: {
      url: 'claims',
      method: 'put',
    },
    details: {
      get: {
        url: 'claims',
        method: 'get',
      },
      create: {
        url: 'claims',
        method: 'put',
      },
      remove: {
        url: 'claims',
        method: 'delete',
      },
    },
  },
  payout: {
    create: {
      url: 'payout',
      method: 'post',
    },
  },
}
