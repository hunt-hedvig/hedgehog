import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  ServerError,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { refreshAccessToken } from 'api/index'
import { toast } from 'react-hot-toast'
import { forceLogOut } from 'utils/auth'

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
