import {
  defaultDataIdFromObject,
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'

import introspectionQueryResultData from './fragmentTypes.json'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
})

export const apolloClient = (() => {
  if (typeof window === 'undefined') {
    return undefined
  }

  return new ApolloClient({
    cache: new InMemoryCache({
      fragmentMatcher,
      dataIdFromObject: (object) => {
        switch (object.__typename) {
          case 'Member':
            return object.memberId
          default:
            return defaultDataIdFromObject(object)
        }
      },
    }).restore((window as any).__INITIAL_STATE__),
    link: createHttpLink({
      uri: '/api/graphql',
    }),
  })
})()
