import { ApolloClient, ApolloLink, ServerError } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { cache } from 'apollo/cache'
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist'
import { persistenceMapper } from 'apollo/persistence/mapper'
import { createPersistLink } from 'apollo/persistence/link'
import gql from 'graphql-tag'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { canRenewToken } from 'apollo/lock'

gql`
  # Declare custom directive for IDE completion; don't want this to actually be resolved server-side
  directive @persist on FIELD
`

const setItemWithExpiry = (key: string, value: string, ttl: number) =>
  localStorage.setItem(
    key,
    JSON.stringify({
      value,
      expiry: new Date().getTime() + ttl,
    }),
  )

const getItemWithExpiry = (key: string) => {
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

export const persistor = new CachePersistor({
  persistenceMapper,
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
  trigger: 'write',
  debounce: 100,
})

const SCHEMA_VERSION = '4'
const SCHEMA_VERSION_KEY = 'apollo-schema-version'

const currentVersion = localStorage.getItem(SCHEMA_VERSION_KEY)

if (currentVersion === SCHEMA_VERSION) {
  persistor.restore()
} else {
  persistor.purge()
  localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION)
}

export const client = new ApolloClient({
  link: ApolloLink.from([
    onError((error) => {
      if (
        !canRenewToken() ||
        ![401, 403].includes(
          (error?.networkError as ServerError)?.response?.status,
        )
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
    createPersistLink(),
    new BatchHttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
      batchInterval: 20,
    }),
  ]),
  connectToDevTools: Boolean(localStorage.getItem('__debug:apollo')),
  cache,
})
