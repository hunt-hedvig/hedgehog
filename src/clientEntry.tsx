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
import { Route, Router, Switch } from 'react-router'

export const history =
  typeof window !== 'undefined' ? createBrowserHistory() : createMemoryHistory()

const App: React.FC = () => {
  const { portal, error } = useAuthenticate()

  if (error) {
    window.location.pathname = '/login/logout'
    return null
  }

  if (!portal) {
    return null
  }

  const Portal = app(portal)

  return Portal ? <Portal /> : null
}

ReactDOM.render(
  <CookiesProvider>
    <BrowserRouter>
      <Router history={history}>
        <Switch>
          <Route
            path="/gatekeeper"
            exact
            component={() => {
              window.location.href = `${
                (window as any).GATEKEEPER_HOST
              }/sso?redirect=${window.location.protocol}//${
                window.location.host
              }/login/callback`

              return null
            }}
          />
        </Switch>
      </Router>
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
