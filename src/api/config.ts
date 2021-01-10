export default {
  baseUrl: '/api/',
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
    edit: {
      method: 'post',
      url: 'member',
    },
  },
  claims: {
    update: {
      url: 'claims',
      method: 'post',
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
