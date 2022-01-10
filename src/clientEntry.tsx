import { ApolloProvider } from '@apollo/client'
import { createBrowserHistory, createMemoryHistory } from 'history'
import React from 'react'
import { CookiesProvider } from 'react-cookie'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { apolloClient } from 'server/apollo-client'
import { app } from 'portals'
import { Global } from '@emotion/react'
import { DarkmodeProvider } from '@hedvig-ui/hooks/use-darkmode'
import { GlobalStyles } from '@hedvig-ui/themes'
import { useAuthenticate } from 'auth/use-authenticate'

export const history =
  typeof window !== 'undefined' ? createBrowserHistory() : createMemoryHistory()

const App: React.FC = () => {
  const { portal } = useAuthenticate()

  if (!portal) {
    return null
  }

  const Portal = app(portal)

  return Portal ? <Portal /> : null
}

ReactDOM.render(
  <CookiesProvider>
    <BrowserRouter>
      <ApolloProvider client={apolloClient!}>
        <Global styles={GlobalStyles} />
        <DarkmodeProvider>
          <App />
        </DarkmodeProvider>
      </ApolloProvider>
    </BrowserRouter>
  </CookiesProvider>,
  document.getElementById('react-root'),
)
