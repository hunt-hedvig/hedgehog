import { ApolloProvider } from '@apollo/client'
import { apolloClient } from 'api/apollo-client'
import { HotApp } from 'App'
import { createBrowserHistory, createMemoryHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

export const history =
  typeof window !== 'undefined' ? createBrowserHistory() : createMemoryHistory()

const appElement = document.getElementById('react-root')

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={apolloClient!}>
      <HotApp />
    </ApolloProvider>
  </BrowserRouter>,
  appElement,
)
