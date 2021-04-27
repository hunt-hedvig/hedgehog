import { MembersSearch } from 'components/members-search'
import MemberPage from 'containers/MemberPage'
import * as PropTypes from 'prop-types'
import React from 'react'
import { Route, Switch } from 'react-router'
import PrivateRoute from 'routes/PrivateRoute'

const MessagesPageRouter = ({ store }) => (
  <Switch>
    <Route
      exact
      path="/members"
      render={() => (
        <PrivateRoute component={MembersSearch} path="/members" store={store} />
      )}
    />
    <Route
      path="/members/:memberId/:tab?"
      render={() => (
        <PrivateRoute
          component={MemberPage}
          path="/members/:memberId/:tab?"
          store={store}
        />
      )}
    />
  </Switch>
)

MessagesPageRouter.propTypes = {
  store: PropTypes.object.isRequired,
}

export default MessagesPageRouter
