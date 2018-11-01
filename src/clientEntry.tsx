import { apolloClient } from 'api/apollo-client'
import { HotApp } from 'App'
import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

const appElement = document.getElementById('react-root')
appElement.style.height = '100%'

ReactDOM.hydrate(
  <BrowserRouter>
    <ApolloProvider client={apolloClient!}>
      <HotApp />
    </ApolloProvider>
  </BrowserRouter>,
  appElement,
)
