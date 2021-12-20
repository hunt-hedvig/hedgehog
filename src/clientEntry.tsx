import { ApolloProvider } from '@apollo/client'
import { createBrowserHistory, createMemoryHistory } from 'history'
import React from 'react'
import { CookiesProvider } from 'react-cookie'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { apolloClient } from 'server/apollo-client'
import { app } from 'portals'

const App = app('Hope')

export const history =
  typeof window !== 'undefined' ? createBrowserHistory() : createMemoryHistory()

ReactDOM.render(
  <CookiesProvider>
    <BrowserRouter>
      <ApolloProvider client={apolloClient!}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </CookiesProvider>,
  document.getElementById('react-root'),
)
