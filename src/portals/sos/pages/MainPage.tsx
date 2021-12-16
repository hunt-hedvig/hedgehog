import { Page } from 'portals/sos/pages/routes'
import React from 'react'
import styled from '@emotion/styled'
import {
  Logo,
  LogoIcon,
} from 'portals/hope/features/navigation/sidebar/elements'
import { colorsV3 } from '@hedviginsurance/brand'
import { MemberSearchForm } from 'portals/sos/features/member-search/MemberSearchForm'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  padding-top: 15vh;
  padding-left: 10vw;
  padding-right: 10vw;

  background-color: ${({ theme }) => theme.background};
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

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;

  margin-bottom: 5rem;
  margin-right: -0.5rem;
`

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
`

const MainPage: Page = () => {
  return (
    <Container>
      <LogoContainer>
        <HopeLogo />
        <HopeLogoIcon />
      </LogoContainer>
      <FormContainer>
        <MemberSearchForm />
      </FormContainer>
    </Container>
  )
}

export default MainPage
