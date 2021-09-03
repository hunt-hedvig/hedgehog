import { ClaimsList } from 'components/claims'
import { ClaimDetails } from 'components/claims/claim-details'
import React from 'react'
import { Route, Switch } from 'react-router'

const ClaimsPageRoute = () => (
  <Switch>
    <Route exact path="/claims/list/:page?" component={ClaimsList} />
    <Route
      exact
      path="/claims/:claimId/members/:memberId"
      component={ClaimDetails}
    />
  </Switch>
)

export default ClaimsPageRoute
