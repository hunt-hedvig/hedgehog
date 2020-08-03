import { Dashboard } from 'components/dashboard'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import actions from 'store/actions'

const DashboardPage = (props) => <Dashboard {...props} />

export default withRouter(
  connect(
    ({ auth, messages, dashboard }) => ({
      auth,
    }),
    {
      ...actions.clientActions,
    },
  )(DashboardPage),
)
