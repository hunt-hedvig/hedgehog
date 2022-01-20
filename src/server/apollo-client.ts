import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  ServerError,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist'

const setItemWithExpiry = (key, value, ttl) =>
  localStorage.setItem(
    key,
    JSON.stringify({
      value,
      expiry: new Date().getTime() + ttl,
    }),
  )

const getItemWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key)

  if (!itemStr) {
    return null
  }

  const item = JSON.parse(itemStr)

  if (new Date().getTime() > item.expiry) {
    localStorage.removeItem(key)
    return null
  }

  return item.value
}

const addTimezoneOffsetHeader = setContext((_operation, previousContext) => {
  const { headers } = previousContext
  return {
    ...previousContext,
    headers: {
      ...headers,
      clientTimezoneOffset: new Date().getTimezoneOffset(),
    },
  }
})

const refreshAccessToken = async () => {
  if (getItemWithExpiry('hvg:refreshingAccessToken') === 'true') {
    // bail if we're already refreshing
    return
  }

  try {
    setItemWithExpiry('hvg:refreshingAccessToken', 'true', 10000)
    await axios.post('/login/refresh', null, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      withCredentials: true,
    })
  } finally {
    localStorage.removeItem('hvg:refreshingAccessToken')
  }
}

const cache = new InMemoryCache({
  typePolicies: {
    Member: {
      keyFields: ['memberId'],
    },
    ResourceAccessInformation: {
      keyFields: ['resourceId'],
    },
    Renewal: {
      keyFields: ['draftOfAgreementId'],
    },
    ChatMessage: {
      keyFields: ['globalId'],
    },
    MemberReferral: {
      keyFields: ['memberId'],
    },
    ClaimEvent: {
      keyFields: ['text', 'date'],
    },
    ClaimFileUpload: {
      keyFields: ['claimFileId'],
    },
    ClaimNote: {
      keyFields: ['date', 'handlerReference'],
    },
    Query: {
      fields: {
        employees: {
          merge: false,
        },
        questionGroups: {
          merge: false,
        },
      },
    },
  },
})

await persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
})

export const apolloClient = (() => {
  return new ApolloClient({
    link: ApolloLink.from([
      onError((error) => {
        if (
          document.hidden ||
          (error?.networkError as ServerError)?.response?.status !== 403
        ) {
          return
        }

        refreshAccessToken().catch((e) => {
          console.error('Failed to refresh access token', e)
          toast.loading('Authentication failed')
          window.location.pathname = '/login/logout'
        })
      }),
      addTimezoneOffsetHeader,
      new HttpLink({ uri: '/api/graphql', credentials: 'same-origin' }),
    ]),
    connectToDevTools: Boolean(localStorage.getItem('__debug:apollo')),
    cache,
  })
})()
