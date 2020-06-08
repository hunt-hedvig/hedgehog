import ClaimDetails from 'components/claims/claim-details'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import actions from 'store/actions'

const ClaimDetailsPage = (props) => <ClaimDetails {...props} />

const mapStateToProps = ({ claimDetails, claims, messages, auth }) => ({
  claimDetails,
  auth,
  messages,
  types: claims.types,
  member: messages.member,
})

export default withRouter(
  // @ts-ignore
  connect(mapStateToProps, {
    ...actions.claimDetailsActions,
    ...actions.notesActions,
    ...actions.messagesActions,
    ...actions.paymentActions,
    ...actions.notificationsActions,
    memberRequest: actions.messagesActions.memberRequest,
    claimTypes: actions.claimsActions.claimTypes,
  })(ClaimDetailsPage),
)
