import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  ServerError,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { refreshAccessToken } from 'api/index'
import { Store } from 'redux'
import { showNotification } from 'store/actions/notificationsActions'
import { forceLogOut } from 'utils/auth'

export const apolloClient = (() => {
  if (typeof window === 'undefined') {
    return undefined
  }

  return new ApolloClient({
    link: ApolloLink.from([
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
      },
    }),
  })
})()
