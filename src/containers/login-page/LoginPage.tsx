import * as React from 'react'
import styled from 'react-emotion'
import { Header, Segment } from 'semantic-ui-react'

const LoginContainer = styled(Segment)`
  &&& {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 400px;
    margin: 200px auto;
    & a {
      margin: 20px auto;
    }
  }
`

const LoginPage = () => (
  <LoginContainer>
    <Header size="huge">Login</Header>
    <a
      href={`${(window as any).GATEKEEPER_HOST}/sso?redirect=${
        window.location.protocol
      }//${window.location.host}/login/callback`}
    >
      Log in
    </a>
  </LoginContainer>
)

export default LoginPage
