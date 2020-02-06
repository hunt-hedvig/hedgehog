import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router'
import { authCheck, AuthState } from 'store/actions/auth'
import { BackofficeStore } from 'store/storeTypes'

const PrivateRouteComponent = ({
  component: Component,
  authState,
  authCheck,
  ...rest
}) => {
  React.useEffect(() => {
    if (authState === AuthState.UNKNOWN) {
      authCheck()
    }
  }, [authState])

  return (
    <Route
      {...rest}
      render={(props) => {
        if (authState === AuthState.UNKNOWN) {
          return 'loading'
        }

        if (authState === AuthState.UNAUTHENTICATED) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          )
        }

        return <Component {...props} />
      }}
    />
  )
}

const mapState = (state: BackofficeStore) => ({
  authState: state.auth.state,
})

const mapActions = { authCheck }

const PrivateRoute = connect(mapState, mapActions)(PrivateRouteComponent)

export default PrivateRoute
