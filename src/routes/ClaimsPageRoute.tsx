import { ClaimsList } from 'components/claims'
import { ClaimDetails } from 'components/claims/claim-details'
import * as PropTypes from 'prop-types'
import React from 'react'
import { Route, Switch } from 'react-router'
import { PrivateRoute } from 'routes/PrivateRoute'

const ClaimsPageRoute = ({ store }) => (
  <Switch>
    <Route
      exact
      path="/claims/list/:page?"
      render={() => (
        <PrivateRoute
          component={ClaimsList}
          path="/claims/list/:page?"
          store={store}
        />
      )}
    />
    <Route
      exact
      path="/claims/:claimId/members/:memberId"
      render={() => (
        <PrivateRoute
          component={ClaimDetails}
          path="/claims/:claimId/members/:memberId"
          store={store}
        />
      )}
    />
  </Switch>
)

ClaimsPageRoute.propTypes = {
  store: PropTypes.object.isRequired,
}

export default ClaimsPageRoute
