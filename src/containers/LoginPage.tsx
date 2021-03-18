import React from 'react'

const LoginPage = () => {
  React.useEffect(() => {
    window.location.href = `${(window as any).GATEKEEPER_HOST}/sso?redirect=${
      window.location.protocol
    }//${window.location.host}/login/callback`
  }, [])

  return null
}

export default LoginPage
