import { ApolloProvider } from '@apollo/client'
import { HotApp } from 'portals/hope/App'
import { createBrowserHistory, createMemoryHistory } from 'history'
import React from 'react'
import { CookiesProvider } from 'react-cookie'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { apolloClient } from 'server/apollo-client'

export const history =
  typeof window !== 'undefined' ? createBrowserHistory() : createMemoryHistory()

const appElement = document.getElementById('react-root')

ReactDOM.render(
  <CookiesProvider>
    <BrowserRouter>
      <ApolloProvider client={apolloClient!}>
        <HotApp />
      </ApolloProvider>
    </BrowserRouter>
  </CookiesProvider>,
  appElement,
)
