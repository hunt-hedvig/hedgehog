export default {
  baseUrl: '/api/',
  login: {
    login: {
      method: 'get',
      url: 'settings/me',
    },
  },
  payout: {
    create: {
      url: 'payout',
      method: 'post',
    },
  },
}
