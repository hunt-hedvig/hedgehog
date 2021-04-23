import { css, Global, ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { colorsV3, fonts, getCdnFontFaces } from '@hedviginsurance/brand'
import { CssBaseline } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { DashboardPage } from 'components/dashboard'
import { QuestionsPage } from 'components/questions'
import { Navigation } from 'components/shared/navigation'
import Breadcrumbs from 'components/shared/navigation/breadcrumbs/Breadcrumbs'
import Notifications from 'containers/NotificationService'
import {
  darkTheme,
  darkUiTheme,
  lightTheme,
  lightUiTheme,
  SemanticOverrides,
} from 'hedvig-ui/themes'
import React, { useState } from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import { Redirect, Route, Router, Switch } from 'react-router'
import Routes from 'routes'
import Store, { history } from 'store'
import { DarkmodeContext, getDefaultIsDarkmode } from 'utils/darkmode-context'
import { CommandLineProvider } from 'utils/hooks/command-line-hook'
import { MemberHistoryProvider } from 'utils/member-history'
import { NumberMemberGroupsProvider } from 'utils/number-member-groups-context'

const store = Store.configureStore()

if (process.env.NODE_ENV !== 'production') {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__store = store
  }
}

const Layout = styled(SemanticOverrides)`
  display: flex;
  min-height: 100vh;
`

const Main = styled.div<{ dark: boolean }>`
  background-color: ${({ dark, theme }) =>
    dark ? colorsV3.gray900 : theme.background};
  color: ${({ theme }) => theme.foreground};
  flex: 1;
  padding: 3rem 4rem;
`

const globalCss = css`
  ${getCdnFontFaces()}

  * {
    box-sizing: border-box;
    font-family: ${fonts.FAVORIT}, sans-serif;
    transition: background 1000ms, color 1000ms;
  }

  body {
    font-family: ${fonts.FAVORIT}, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  .ui.header {
    font-family: ${fonts.FAVORIT}, sans-serif;
    font-kerning: none;
    font-weight: 400;
  }
`

const App: React.FC = () => {
  const [isDarkmode, setIsDarkmode] = useState(getDefaultIsDarkmode())

  const redirectToLogin = () => {
    window.location.href = `${(window as any).GATEKEEPER_HOST}/sso?redirect=${
      window.location.protocol
    }//${window.location.host}/login/callback`
  }

  return (
    <DarkmodeContext.Provider
      value={{
        isDarkmode,
        setIsDarkmode: (newIsDarkmode) => {
          setIsDarkmode(newIsDarkmode)
          localStorage.setItem(
            'hedvig:theming:darkmode',
            JSON.stringify(newIsDarkmode),
          )
        },
      }}
    >
      <MuiThemeProvider theme={isDarkmode ? darkUiTheme : lightUiTheme}>
        <CssBaseline />
        <Global styles={globalCss} />
        <ThemeProvider theme={isDarkmode ? darkTheme : lightTheme}>
          <Provider store={store}>
            <MemberHistoryProvider>
              <NumberMemberGroupsProvider>
                <Router history={history}>
                  <CommandLineProvider>
                    <Layout>
                      <Navigation history={history} store={store} />
                      <Main
                        dark={history.location.pathname.startsWith('/login')}
                      >
                        <Breadcrumbs />
                        <Switch>
                          <Route
                            path="/login"
                            exact
                            component={() => {
                              redirectToLogin()
                              return null
                            }}
                          />
                          <Routes.PrivateRoute
                            path="/dashborad"
                            store={store}
                            component={DashboardPage}
                          />
                          <Routes.PrivateRoute
                            path="/questions"
                            store={store}
                            component={QuestionsPage}
                          />
                          <Route
                            path="/claims"
                            render={(routeProps) => (
                              <Routes.ClaimsPageRoute
                                {...routeProps}
                                store={store}
                              />
                            )}
                          />
                          <Route
                            path="/members"
                            render={(routeProps) => (
                              <Routes.MembersPageRoute
                                {...routeProps}
                                store={store}
                              />
                            )}
                          />
                          <Routes.PrivateRoute
                            path="/tools"
                            store={store}
                            component={Routes.ToolsPageRoute}
                          />
                          <Redirect from="*" to="/dashborad" />
                        </Switch>
                        <Notifications />
                      </Main>
                    </Layout>
                  </CommandLineProvider>
                </Router>
              </NumberMemberGroupsProvider>
            </MemberHistoryProvider>
          </Provider>
        </ThemeProvider>
      </MuiThemeProvider>
    </DarkmodeContext.Provider>
  )
}

export const HotApp = hot(App)
