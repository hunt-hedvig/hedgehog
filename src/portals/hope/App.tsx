import styled from '@emotion/styled'
import { BaseStyle, Spinner, StandaloneMessage } from '@hedvig-ui'
import { ConfirmDialogProvider } from '@hedvig-ui/Modal/use-confirm-dialog'
import { colorsV3 } from '@hedviginsurance/brand'
import { history } from 'entry'
import { CommandLineProvider } from 'portals/hope/features/commands/use-command-line'
import { VerticalMenu } from 'portals/hope/features/navigation/sidebar/VerticalMenu'
import { TopBar } from 'portals/hope/features/navigation/topbar/TopBar'
import { TrackingProvider } from 'portals/hope/features/tracking/hooks/use-tracking'
import { Tracker } from 'portals/hope/features/tracking/Tracker'
import { useAuthenticate } from 'portals/hope/features/user/hooks/use-authenticate'
import { MeProvider } from 'portals/hope/features/user/hooks/use-me'
import { MemberHistoryProvider } from 'portals/hope/features/user/hooks/use-member-history'
import { NumberMemberGroupsProvider } from 'portals/hope/features/user/hooks/use-number-member-groups'
import { TemplateMessagesProvider } from 'portals/hope/features/template-messages/use-template-messages'
import { Routes } from 'portals/hope/pages/routes'
import React, { useEffect } from 'react'
import TagManager from 'react-gtm-module'
import { hot } from 'react-hot-loader/root'
import { Toaster } from 'react-hot-toast'
import { Switch } from 'react-router'
import { NavigationProvider } from '@hedvig-ui/hooks/navigation/use-navigation'

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

const App: React.FC = () => {
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

  if (loading || !me) {
    return (
      <StandaloneMessage paddingTop="45vh" opacity={1}>
        <Spinner />
      </StandaloneMessage>
    )
  }

  return (
    <NavigationProvider>
      <TrackingProvider>
        <MemberHistoryProvider>
          <NumberMemberGroupsProvider>
            <MeProvider me={me}>
              <CommandLineProvider>
                <TemplateMessagesProvider>
                  <ConfirmDialogProvider>
                    <Layout>
                      <Tracker />
                      {!history.location.pathname.startsWith('/login') && (
                        <VerticalMenu />
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
                </TemplateMessagesProvider>
              </CommandLineProvider>
            </MeProvider>
          </NumberMemberGroupsProvider>
        </MemberHistoryProvider>
      </TrackingProvider>
    </NavigationProvider>
  )
}

export const HOPEHotApp = hot(App)
