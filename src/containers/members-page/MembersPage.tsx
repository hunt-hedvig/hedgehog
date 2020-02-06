import Members from 'components/members'
import { ListPage } from 'components/shared'
import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import actions from 'store/actions'

const MembersPage = (props) => (
  <ListPage>
    <Members {...props} />
  </ListPage>
)

const mapStateToProps = ({ members, messages }) => ({
  members,
  messages,
})

export default withRouter(
  connect(mapStateToProps, {
    ...actions.clientActions,
    ...actions.membersActions,
    ...actions.messagesActions,
  })(MembersPage),
)
