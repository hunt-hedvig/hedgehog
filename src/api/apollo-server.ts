import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink, concat } from 'apollo-link'
import { BatchHttpLink } from 'apollo-link-batch-http'
import * as uuidV4 from 'uuid/v4'

const requestIdMiddleware = (requestId?: string) =>
  new ApolloLink((operation, forward) => {
    operation.setContext({ headers: { 'x-request-id': requestId || uuidV4() } })

    if (forward === undefined || forward === null) {
      throw new Error(
        `Expected thing to be not nullable but was ${typeof forward}`,
      )
    }

    return forward(operation)
  })

export const createServerApolloClient = (requestId?: string) =>
  new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: concat(
      requestIdMiddleware(requestId),
      new BatchHttpLink({
        uri: 'https://graphql.dev.hedvigit.com/graphql',
        fetch: require('node-fetch'),
      }),
    ),
  })
