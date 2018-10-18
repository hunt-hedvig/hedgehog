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
    logout: {
      method: 'post',
      url: 'logout',
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
  },
  claims: {
    getList: {
      url: 'claims',
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
  questions: {
    get: {
      url: 'questions',
      method: 'get',
    },
    answered: {
      url: 'questions/answered',
      method: 'get',
    },
    notAnsewred: {
      url: 'questions/not-answered',
      method: 'get',
    },
    sendAnswer: {
      url: 'questions/answer',
      method: 'post',
    },
    sendDoneMsg: {
      url: 'questions/done',
      method: 'post',
    },
  },
  insurance: {
    get: {
      url: 'member/insurance',
      method: 'get',
    },
    setDate: {
      url: 'member/insurance',
      method: 'post',
    },
    cancel: {
      url: 'member/insurance',
      method: 'post',
    },
    cert: {
      url: 'member/insurance',
      method: 'post',
    },
    companyStatus: {
      url: 'member/insurance',
      method: 'post',
    },
    getInsurancesByMember: {
      url: 'member/insurance',
      method: 'get',
    },
    createModifiedInsurance: {
      url: 'member/insurance',
      method: 'post',
    },
    modifyProduct: {
      url: 'member/insurance',
      method: 'post',
    },
  },
  insMembers: {
    get: {
      method: 'get',
      url: 'member/insurance/search',
    },
  },
  reports: {
    getBDX: {
      method: 'get',
      url: 'reports/bdx',
    },
  },
  ws: {
    // eslint-disable-next-line
    endpoint:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080/chat'
        : '/chat',
    messagesPrefix: '/user/',
    messages: '/messages/',
    history: '/app/messages/history/',
    send: '/app/messages/send/',
    dashboardSub: '/user/',
    cleanupDashboard: '/app/updates/clear/',
    dashboardUpdates: '/app/updates/',
    cleanupMessages: '/app/clear/',
    newMessagesSub: '/app/updates/',
    messagesUpdates: '/app/updates/',
  },
}
