import {
  defaultDataIdFromObject,
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-boost'

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
  })
})()
