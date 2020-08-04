import ClaimDetails from 'components/claims/claim-details'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import actions from 'store/actions'

const ClaimDetailsPage = (props) => <ClaimDetails {...props} />

const mapStateToProps = ({ claimDetails, claims, auth }) => ({
  claimDetails,
  auth,
  types: claims.types,
})

export default withRouter(
  // @ts-ignore
  connect(mapStateToProps, {
    ...actions.claimDetailsActions,
    ...actions.notesActions,
    ...actions.paymentActions,
    ...actions.notificationsActions,
    claimTypes: actions.claimsActions.claimTypes,
  })(ClaimDetailsPage),
)
