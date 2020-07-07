import { refreshAccessToken } from 'api/index'
import { ApolloClient, ApolloLink, HttpLink } from 'apollo-boost'
import {
  defaultDataIdFromObject,
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { ServerError } from 'apollo-link-http-common'
import { Store } from 'redux'
import { showNotification } from 'store/actions/notificationsActions'
import { forceLogOut } from 'utils/auth'

import introspectionQueryResultData from './fragmentTypes.json'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
})

export const apolloClient = (() => {
  if (typeof window === 'undefined') {
    return undefined
  }

  return new ApolloClient({
    link: ApolloLink.from([
      new HttpLink({ uri: '/api/graphql', credentials: 'same-origin' }),
      onError((error) => {
        if ((error?.networkError as ServerError)?.response?.status !== 403) {
          return
        }

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
          .catch((e) => {
            console.error('Failed to refresh access token', e)
            ;((window as any).__store as Store).dispatch(
              showNotification({
                header: 'Authentication failed',
                message:
                  "The request failed because the authentication needed to refresh, but it failed. You're being logged out",
                type: 'red',
              }),
            )
            forceLogOut()
          })
      }),
    ]),
    connectToDevTools: Boolean(localStorage.getItem('__debug:apollo')),
    cache: new InMemoryCache({
      fragmentMatcher,
      dataIdFromObject: (object) => {
        switch (object.__typename) {
          case 'Member':
            return `Member(${(object as any).memberId})`
          case 'Renewal':
            return `Renewal(${(object as any).draftOfAgreementId})`
          case 'ChatMessage':
            return `ChatMessage(${(object as any).globalId})`
          default:
            return defaultDataIdFromObject(object)
        }
      },
    }),
  })
})()
