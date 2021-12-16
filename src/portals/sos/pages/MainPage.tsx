import { Page } from 'portals/sos/pages/routes'
import React from 'react'
import styled from '@emotion/styled'
import { MemberSearchForm } from 'portals/sos/features/member-search/MemberSearchForm'
import chroma from 'chroma-js'
import { useAuthenticate } from 'portals/hope/features/user/hooks/use-authenticate'
import { Route, Switch } from 'react-router'

const Container = styled.div`
  width: 100vw;
  height: 90vh;
  padding-left: 10vw;
  padding-right: 10vw;

  background-color: ${({ theme }) => theme.background};
`

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;

  height: 10vh;
  background-color: ${({ theme }) => theme.backgroundTransparent};

  a {
    text-decoration: underline;
    color: ${({ theme }) => chroma(theme.foreground).brighten(1).hex()};
    margin-top: 4vh;
    transition: color 200ms;

    :hover {
      color: ${({ theme }) => chroma(theme.foreground).brighten(2).hex()};
    }
  }
`

const redirectToLogin = () => {
  window.location.href = `${(window as any).GATEKEEPER_HOST}/sso?redirect=${
    window.location.protocol
  }//${window.location.host}/login/callback`
}

const MainPage: Page = () => {
  const { me, loading } = useAuthenticate()

  if (loading) {
    return null
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
    <>
      <Container>
        <MemberSearchForm />
      </Container>
      <Footer>
        <a href="/login/logout">Sign out</a>
      </Footer>
    </>
  )
}

export default MainPage
