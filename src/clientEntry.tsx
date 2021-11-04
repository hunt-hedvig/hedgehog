import { ApolloProvider } from '@apollo/client'
import { HotApp } from 'App'
import { TrackingProvider } from 'features/tracking/use-tracking'
import { createBrowserHistory, createMemoryHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { apolloClient } from 'server/apollo-client'

export const history =
  typeof window !== 'undefined' ? createBrowserHistory() : createMemoryHistory()

const appElement = document.getElementById('react-root')

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={apolloClient!}>
      <TrackingProvider>
        <HotApp />
      </TrackingProvider>
    </ApolloProvider>
  </BrowserRouter>,
  appElement,
)
