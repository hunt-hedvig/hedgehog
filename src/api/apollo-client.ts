import { refreshAccessToken } from 'api/index'
import {
  defaultDataIdFromObject,
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { ServerError } from 'apollo-link-http-common'
import ApolloClient from 'apollo-boost'
import { Store } from 'redux'
import { history } from 'store'
import { showNotification } from 'store/actions/notificationsActions'

import introspectionQueryResultData from './fragmentTypes.json'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
})

export const apolloClient = (() => {
  if (typeof window === 'undefined') {
    return undefined
  }

  return new ApolloClient({
    uri: '/api/graphql',
    cache: new InMemoryCache({
      fragmentMatcher,
      dataIdFromObject: (object) => {
        switch (object.__typename) {
          case 'Member':
            return (object as any).memberId
          default:
            return defaultDataIdFromObject(object)
        }
      },
    }),
    credentials: 'same-origin',
    onError: (error) => {
      if ((error?.networkError as ServerError)?.response?.status === 403) {
        refreshAccessToken()
          .then(() => {
            ;((window as any).__store as Store).dispatch(
              showNotification({
                header: 'Authentication error',
                message:
                  'The request failed because the authentication needed to refresh, please try again',
                type: 'yellow',
              }),
            )
          })
          .catch((_) => {
            history.push('/login')
          })
      }
    },
  })
})()
