import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { BaseStyle, darkTheme, lightTheme, StandaloneMessage } from '@hedvig-ui'
import {
  getDefaultIsDarkmode,
  UseDarkmode,
} from '@hedvig-ui/hooks/use-darkmode'
import { ConfirmDialogProvider } from '@hedvig-ui/Modal/use-confirm-dialog'
import { colorsV3 } from '@hedviginsurance/brand'
import { history } from 'clientEntry'
import { CommandLineProvider } from 'portals/hope/features/commands/use-command-line'
import { NavigationProvider } from 'portals/hope/features/navigation/hooks/use-navigation'
import {
  Logo,
  LogoIcon,
} from 'portals/hope/features/navigation/sidebar/elements'
import { VerticalMenu } from 'portals/hope/features/navigation/sidebar/VerticalMenu'
import { TopBar } from 'portals/hope/features/navigation/topbar/TopBar'
import { TrackingProvider } from 'portals/hope/features/tracking/hooks/use-tracking'
import { Tracker } from 'portals/hope/features/tracking/Tracker'
import { useAuthenticate } from 'portals/hope/features/user/hooks/use-authenticate'
import { MeProvider } from 'portals/hope/features/user/hooks/use-me'
import { MemberHistoryProvider } from 'portals/hope/features/user/hooks/use-member-history'
import { NumberMemberGroupsProvider } from 'portals/hope/features/user/hooks/use-number-member-groups'
import { Routes } from 'portals/hope/pages/routes'
import React, { useEffect, useState } from 'react'
import TagManager from 'react-gtm-module'
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

  useEffect(() => {
    if (!me) {
      return
    }

    TagManager.initialize({
      gtmId: 'GTM-MPF6CLX',
      dataLayer: {
        userEmail: me.user.email,
        environment: process.env.NODE_ENV,
      },
    })
  }, [me])

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
      <TrackingProvider>
        <ThemeProvider theme={isDarkmode ? darkTheme : lightTheme}>
          <NavigationProvider>
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
                            dark={history.location.pathname.startsWith(
                              '/login',
                            )}
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
          </NavigationProvider>
        </ThemeProvider>
      </TrackingProvider>
    </UseDarkmode.Provider>
  )
}

export const HOPEHotApp = hot(App)
