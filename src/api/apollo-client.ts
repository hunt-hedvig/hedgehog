import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'

export const apolloClient = (() => {
  if (typeof window === 'undefined') {
    return undefined
  }

  return new ApolloClient({
    cache: new InMemoryCache().restore((window as any).__INITIAL_STATE__),
    link: createHttpLink({
      uri: 'https://graphql.dev.hedvigit.com/graphql',
    }),
  })
})()
