import { ApolloProvider } from '@apollo/client'
import { createBrowserHistory, createMemoryHistory } from 'history'
import React from 'react'
import { CookiesProvider } from 'react-cookie'
import ReactDOM from 'react-dom'
import { apolloClient } from 'server/apollo-client'
import { app } from 'portals'
import { Global } from '@emotion/react'
import { DarkmodeProvider } from '@hedvig-ui/hooks/use-darkmode'
import { GlobalStyles } from '@hedvig-ui/themes'
import { useAuthenticate } from 'auth/use-authenticate'
import { Route, Router, Switch } from 'react-router'
import { PortalsPage } from 'auth/PortalsPage'

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
    <Router history={history}>
      <ApolloProvider client={apolloClient!}>
        <DarkmodeProvider>
          <Global styles={GlobalStyles} />
          <Switch>
            <Route exact path="/portals" component={PortalsPage} />
            <Route
              exact
              path="/gatekeeper"
              component={() => {
                window.location.href = `${
                  (
                    window as Window &
                      typeof global & { GATEKEEPER_HOST: string }
                  ).GATEKEEPER_HOST
                }/sso?redirect=${window.location.protocol}//${
                  window.location.host
                }/login/callback`

                return null
              }}
            />
            <Route component={App} />
          </Switch>
        </DarkmodeProvider>
      </ApolloProvider>
    </Router>
  </CookiesProvider>,
  document.getElementById('react-root'),
)
