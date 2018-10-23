import ChatPage from 'containers/chat-page/ChatPage'
import MembersPage from 'containers/members-page/MembersPage'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Route, Switch } from 'react-router'
import PrivateRoute from 'routes/PrivateRoute'

const MessagesPageRouter = ({ store }) => (
  <Switch>
    <Route
      exact
      path="/members"
      render={() => (
        <PrivateRoute component={MembersPage} path="/members" store={store} />
      )}
    />
    <Route
      path="/members/:id/:msgId?"
      render={() => (
        <PrivateRoute
          component={ChatPage}
          path="/members/:id/:msgId?"
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
