import { useGetMeQuery } from 'api/generated/graphql'
import { LoadingMessage } from 'hedvig-ui/animations/standalone-message'
import React from 'react'
import { Redirect, Route } from 'react-router'

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { data, loading, error } = useGetMeQuery()

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return (
            <LoadingMessage paddingTop={'25vh'}>Authenticating</LoadingMessage>
          )
        }

        if (error || !data?.me) {
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
