import * as React from 'react'
import { Route } from 'react-router'
import PayoutPage from '../containers/payout-page/PayoutPage'
import PrivateRoute from './PrivateRoute'

const PayoutPageRoute = ({ store }) => (
  <Route
    exact
    path="/payout"
    render={() => (
      <PrivateRoute component={PayoutPage} path="/payout" store={store} />
    )}
  />
)

export default PayoutPageRoute
