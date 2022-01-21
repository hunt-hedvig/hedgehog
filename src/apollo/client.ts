import { ApolloClient, ApolloLink, HttpLink, ServerError } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { cache } from 'apollo/cache'
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist'
import { persistenceMapper } from 'apollo/persistence/mapper'
import { createPersistLink } from 'apollo/persistence/link'

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

export const persistor = new CachePersistor({
  persistenceMapper,
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
  trigger: 'write',
  debounce: 100,
})

const SCHEMA_VERSION = '1'
const SCHEMA_VERSION_KEY = 'apollo-schema-version'

const currentVersion = localStorage.getItem(SCHEMA_VERSION_KEY)

if (currentVersion === SCHEMA_VERSION) {
  await persistor.restore()
} else {
  await persistor.purge()
  localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION)
}

export const client = new ApolloClient({
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
    createPersistLink(),
    new HttpLink({ uri: '/api/graphql', credentials: 'same-origin' }),
  ]),
  connectToDevTools: Boolean(localStorage.getItem('__debug:apollo')),
  cache,
})
