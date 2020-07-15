import Member from 'components/member'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import actions from 'store/actions'

const ChatPage = (props) => <Member {...props} />

const mapStateToProps = ({
  messages,
  claims,
  auth,
  payoutDetails,
}) => ({
  memberClaims: claims.memberClaims,
  messages,
  auth,
  payoutDetails,
})

export default connect(
  mapStateToProps,
  {
    claimsByMember: actions.claimsActions.claimsByMember,
    ...actions.messagesActions,
    ...actions.membersActions,
    ...actions.clientActions,
    ...actions.notificationsActions,
    ...actions.payoutDetailsActions,
  },
  null,
  { pure: false },
)(withRouter(ChatPage))
