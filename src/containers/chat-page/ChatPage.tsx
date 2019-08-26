import Chat from 'components/chat'
import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import actions from 'store/actions'

const ChatPage = (props) => <Chat {...props} />

const mapStateToProps = ({
  messages,
  claims,
  insurance,
  client,
  payoutDetails,
}) => ({
  memberClaims: claims.memberClaims,
  messages,
  insurance,
  client,
  payoutDetails,
})

export default withRouter(
  connect(
    mapStateToProps,
    {
      claimsByMember: actions.claimsActions.claimsByMember,
      ...actions.insuranceActions,
      ...actions.messagesActions,
      ...actions.membersActions,
      ...actions.clientActions,
      ...actions.notificationsActions,
      ...actions.payoutDetailsActions,
    },
  )(ChatPage),
)
