import { Page } from 'portals/sos/pages/routes'
import React from 'react'
import styled from '@emotion/styled'
import {
  Logo,
  LogoIcon,
} from 'portals/hope/features/navigation/sidebar/elements'
import { colorsV3 } from '@hedviginsurance/brand'
import { MemberSearchForm } from 'portals/sos/features/member-search/MemberSearchForm'
import chroma from 'chroma-js'
import { useAuthenticate } from 'portals/hope/features/user/hooks/use-authenticate'
import { StandaloneMessage } from '@hedvig-ui'
import { Route, Switch } from 'react-router'

const Container = styled.div`
  width: 100vw;
  height: 90vh;
  padding-top: 35vh;
  padding-left: 10vw;
  padding-right: 10vw;

  background-color: ${({ theme }) => theme.background};
`

const HopeLogo = styled(Logo)`
  width: 10rem;
  fill: ${colorsV3.gray800};
`

const HopeLogoIcon = styled(LogoIcon)`
  width: 1.4rem;
  fill: ${colorsV3.gray800};
  margin-bottom: 2rem;
`

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;

  margin-bottom: 2rem;
  margin-right: -0.7rem;
`

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
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
    <>
      <Container>
        <LogoContainer>
          <HopeLogo />
          <HopeLogoIcon />
        </LogoContainer>
        <FormContainer>
          <MemberSearchForm />
        </FormContainer>
      </Container>
      <Footer>
        <a href="/login/logout">Sign out</a>
      </Footer>
    </>
  )
}

export default MainPage
