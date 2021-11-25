import { css, Global, ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { BaseStyle, darkTheme, lightTheme, StandaloneMessage } from '@hedvig-ui'
import {
  getDefaultIsDarkmode,
  UseDarkmode,
} from '@hedvig-ui/hooks/use-darkmode'
import { ConfirmDialogProvider } from '@hedvig-ui/Modal/use-confirm-dialog'
import { colorsV3, fonts, getCdnFontFaces } from '@hedviginsurance/brand'
import { history } from 'clientEntry'
import { CommandLineProvider } from 'features/commands/use-command-line'
import { Logo, LogoIcon } from 'features/navigation/sidebar/elements'
import { VerticalMenu } from 'features/navigation/sidebar/VerticalMenu'
import { TopBar } from 'features/navigation/topbar/TopBar'
import { TrackingProvider } from 'features/tracking/hooks/use-tracking'
import { Tracker } from 'features/tracking/Tracker'
import { useAuthenticate } from 'features/user/hooks/use-authenticate'
import { MeProvider } from 'features/user/hooks/use-me'
import { MemberHistoryProvider } from 'features/user/hooks/use-member-history'
import { NumberMemberGroupsProvider } from 'features/user/hooks/use-number-member-groups'
import { Routes } from 'pages/routes'
import React, { useState } from 'react'
import { hot } from 'react-hot-loader/root'
import { Toaster } from 'react-hot-toast'
import { Route, Router, Switch } from 'react-router'

const Layout = styled(BaseStyle)`
  display: flex;
  height: 100vh;
`

const Main = styled.div<{ dark: boolean }>`
  background-color: ${({ dark, theme }) =>
    dark ? colorsV3.gray900 : theme.background};
  color: ${({ theme }) => theme.foreground};
  flex: 1;
  display: flex;
  flex-direction: column;
`

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 4rem 4rem 2rem 4rem;
  overflow-y: auto;
`

const globalCss = css`
  ${getCdnFontFaces()}

  * {
    box-sizing: border-box;
    font-family: ${fonts.FAVORIT}, sans-serif;
    transition: background 1000ms, color 1000ms;
    -webkit-font-smoothing: antialiased;
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
  h6 {
    font-family: ${fonts.FAVORIT}, sans-serif;
    font-kerning: none;
    font-weight: 400;
  }
`

const HopeLogo = styled(Logo)`
  width: 7rem;
  fill: ${colorsV3.gray800};
`

const HopeLogoIcon = styled(LogoIcon)`
  width: 1rem;
  fill: ${colorsV3.gray800};
  margin-bottom: 2rem;
`

const App: React.FC = () => {
  const [isDarkmode, setIsDarkmode] = useState(getDefaultIsDarkmode())
  const { me, loading } = useAuthenticate()

  const redirectToLogin = () => {
    window.location.href = `${(window as any).GATEKEEPER_HOST}/sso?redirect=${
      window.location.protocol
    }//${window.location.host}/login/callback`
  }

  if (loading) {
    return (
      <StandaloneMessage paddingTop="45vh" opacity={1}>
        <HopeLogo />
        <HopeLogoIcon />
      </StandaloneMessage>
    )
  }

  if (!me) {
    return (
      <Switch>
        <Route
          path="/login"
          exact
          component={() => {
            redirectToLogin()
            return null
          }}
        />
      </Switch>
    )
  }

  return (
    <UseDarkmode.Provider
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
      <Global styles={globalCss} />
      <TrackingProvider>
        <ThemeProvider theme={isDarkmode ? darkTheme : lightTheme}>
          <MemberHistoryProvider>
            <NumberMemberGroupsProvider>
              <Router history={history}>
                <MeProvider me={me}>
                  <CommandLineProvider>
                    <ConfirmDialogProvider>
                      <Layout>
                        <Tracker />
                        {!history.location.pathname.startsWith('/login') && (
                          <VerticalMenu history={history} />
                        )}
                        <Main
                          dark={history.location.pathname.startsWith('/login')}
                        >
                          <TopBar />
                          <MainContent>
                            <Switch>
                              <Routes />
                            </Switch>
                            <Toaster
                              position="top-center"
                              toastOptions={{
                                style: {
                                  padding: '20px 25px',
                                },
                              }}
                            />
                          </MainContent>
                        </Main>
                      </Layout>
                    </ConfirmDialogProvider>
                  </CommandLineProvider>
                </MeProvider>
              </Router>
            </NumberMemberGroupsProvider>
          </MemberHistoryProvider>
        </ThemeProvider>
      </TrackingProvider>
    </UseDarkmode.Provider>
  )
}

export const HotApp = hot(App)
