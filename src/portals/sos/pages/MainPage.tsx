import { Page } from 'portals/sos/pages/routes'
import React from 'react'
import styled from '@emotion/styled'
import { MemberSearchForm } from 'portals/sos/features/member-search/MemberSearchForm'
import chroma from 'chroma-js'
import { useAuthenticate } from 'portals/hope/features/user/hooks/use-authenticate'
import { Route, Switch } from 'react-router'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;

  background-color: ${({ theme }) => theme.background};
`

const Content = styled.div`
  min-height: 90vh;
`

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;

  height: 10vh;
  background-color: ${({ theme }) => theme.backgroundTransparent};

  a {
    text-decoration: underline;
    color: ${({ theme }) =>
      chroma(theme.foreground)
        .brighten(1)
        .hex()};
    margin-top: 4vh;
    transition: color 200ms;

    :hover {
      color: ${({ theme }) =>
        chroma(theme.foreground)
          .brighten(2)
          .hex()};
    }
  }
`

const redirectToLogin = () => {
  window.location.href = `${
    (window as Window & typeof global & { LOGIN_URL: string }).LOGIN_URL
  }?redirect=${window.location.protocol}//${
    window.location.host
  }/login/callback`
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
    <Container>
      <Content>
        <MemberSearchForm />
      </Content>
      <Footer>
        <a href="/login/logout">Sign out</a>
      </Footer>
    </Container>
  )
}

export default MainPage
