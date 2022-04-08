import { ApolloProvider } from '@apollo/client'
import React from 'react'
import { CookiesProvider } from 'react-cookie'
import ReactDOM from 'react-dom'
import { client } from 'apollo/client'
import { app } from 'portals'
import { Global } from '@emotion/react'
import { DarkmodeProvider } from '@hedvig-ui'
import { useAuthenticate } from 'auth/use-authenticate'
import { Route, Switch } from 'react-router'
import { PortalsPage } from 'auth/PortalsPage'
import { Spinner, StandaloneMessage, GlobalStyles } from '@hedvig-ui'
import { RenewTokenLock } from 'apollo/lock'
import { TriagingPage } from 'demo/TriagingPage'
import { BrowserRouter } from 'react-router-dom'

const App: React.FC = () => {
  const { portal, error } = useAuthenticate()

  if (error) {
    window.location.pathname = '/login/logout'

    return null
  }

  if (!portal) {
    return (
      <StandaloneMessage paddingTop="45vh" opacity={1}>
        <Spinner />
      </StandaloneMessage>
    )
  }

  const Portal = app(portal)

  return Portal ? <Portal /> : null
}

ReactDOM.render(
  <CookiesProvider>
    <BrowserRouter>
      <RenewTokenLock />
      <ApolloProvider client={client}>
        <DarkmodeProvider>
          <Global styles={GlobalStyles} />
          <Switch>
            <Route exact path="/demo/triaging" component={TriagingPage} />
            <Route exact path="/portals" component={PortalsPage} />
            <Route
              exact
              path="/login-provider"
              component={() => {
                const win = window as Window &
                  typeof global & { LOGIN_URL: string }
                window.location.href = `${win.LOGIN_URL}?redirect=${window.location.protocol}//${window.location.host}/login/callback`

                return null
              }}
            />
            <Route component={App} />
          </Switch>
        </DarkmodeProvider>
      </ApolloProvider>
    </BrowserRouter>
  </CookiesProvider>,
  document.getElementById('react-root'),
)
