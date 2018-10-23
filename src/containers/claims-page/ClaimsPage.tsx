import Claims from 'components/claims'
import { ListPage } from 'components/shared'
import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import actions from 'store/actions'

const ClaimsPage = (props) => (
  <ListPage>
    <Claims {...props} />
  </ListPage>
)

export default withRouter(
  connect(
    ({ claims }) => ({ claims }),
    {
      ...actions.claimsActions,
    },
  )(ClaimsPage),
)
