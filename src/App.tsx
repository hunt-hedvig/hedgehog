import { css, Global, ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import {
  darkTheme,
  darkUiTheme,
  lightTheme,
  lightUiTheme,
  SemanticOverrides,
  StandaloneMessage,
} from '@hedvig-ui'
import { colorsV3, fonts, getCdnFontFaces } from '@hedviginsurance/brand'
import { CssBaseline } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { history } from 'clientEntry'
import { DashboardPage } from 'components/dashboard'
import { QuestionsPage } from 'components/questions'
import Breadcrumbs from 'components/shared/navigation/breadcrumbs/Breadcrumbs'
import { VerticalMenu } from 'components/shared/navigation/sidebar/VerticalMenu'
import React, { useState } from 'react'
import { hot } from 'react-hot-loader/root'
import { Toaster } from 'react-hot-toast'
import { Route, Router, Switch } from 'react-router'
import Routes from 'routes'
import { useAuthenticate } from 'utils/auth'
import { DarkmodeContext, getDefaultIsDarkmode } from 'utils/darkmode-context'
import { CommandLineProvider } from 'utils/hooks/command-line-hook'
import { ConfirmDialogProvider } from 'utils/hooks/modal-hook'
import { MemberHistoryProvider } from 'utils/member-history'
import { NumberMemberGroupsProvider } from 'utils/number-member-groups-context'

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
  const { me } = useAuthenticate()

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
          <MemberHistoryProvider>
            <NumberMemberGroupsProvider>
              <Router history={history}>
                <CommandLineProvider>
                  <ConfirmDialogProvider>
                    <Layout>
                      {!history.location.pathname.startsWith('/login') && (
                        <VerticalMenu history={history} />
                      )}
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
                          {me && (
                            <Switch>
                              <Route
                                path="/dashborad"
                                component={DashboardPage}
                              />
                              <Route
                                path="/questions"
                                component={QuestionsPage}
                              />
                              <Route
                                path="/claims"
                                component={Routes.ClaimsPageRoute}
                              />
                              <Route
                                path="/members"
                                component={Routes.MembersPageRoute}
                              />
                              <Route
                                path="/tools"
                                component={Routes.ToolsPageRoute}
                              />
                              <Route
                                exact
                                path={'/'}
                                component={DashboardPage}
                              />
                              <Route
                                component={() => (
                                  <StandaloneMessage paddingTop={'25vh'}>
                                    Page not found
                                  </StandaloneMessage>
                                )}
                              />
                            </Switch>
                          )}
                        </Switch>
                        <Toaster
                          position={'top-center'}
                          toastOptions={{
                            style: {
                              padding: '20px 25px',
                            },
                          }}
                        />
                      </Main>
                    </Layout>
                  </ConfirmDialogProvider>
                </CommandLineProvider>
              </Router>
            </NumberMemberGroupsProvider>
          </MemberHistoryProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </DarkmodeContext.Provider>
  )
}

export const HotApp = hot(App)
