import { ListPage } from 'components/shared'
import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import actions from 'store/actions'
import PayoutDetails from "../../components/payouts/payout-details"

const PayoutPage = (props) => <PayoutDetails {...props} />

export default withRouter(connect()(PayoutPage))
