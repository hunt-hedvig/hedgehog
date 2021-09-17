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
import { forceLogOut } from 'utils/auth'

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
  const { headers, clientTzOffset } = previousContext
  if (!clientTzOffset) {
    return previousContext
  }

  return {
    ...previousContext,
    headers: {
      ...headers,
      clientTzOffset: new Date().getTimezoneOffset(),
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

export const apolloClient = (() => {
  if (typeof window === 'undefined') {
    return undefined
  }

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
          forceLogOut()
        })
      }),
      addTimezoneOffsetHeader,
      new HttpLink({ uri: '/api/graphql', credentials: 'same-origin' }),
    ]),
    connectToDevTools: Boolean(localStorage.getItem('__debug:apollo')),
    cache: new InMemoryCache({
      typePolicies: {
        Member: {
          keyFields: ['memberId'],
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
          },
        },
      },
    }),
  })
})()
