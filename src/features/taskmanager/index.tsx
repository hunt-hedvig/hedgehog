// import { colors } from '@hedviginsurance/brand'
// import gql from 'graphql-tag'
// import { formatMoneySE } from 'lib/intl'
// import * as moment from 'moment'
import * as React from 'react'
// import { Mutation, Query } from 'react-apollo'
import styled from 'react-emotion'
// import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
// import { Table } from 'semantic-ui-react'
// import { MonetaryAmount } from 'src/components/claims/claim-details/components/ClaimPayments'
// import actions from 'store/actions'
import Tickets from '../../components/tickets/index';


const Header = styled('div')({
  padding: '0 20px',
  textAlign: 'center',
})

export default class TaskManagerPageComponent extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Header>
          <h1>Task Manager</h1>
          <h2>Current Tickets</h2>
        </Header>
        <Tickets />
        {/* <C */}
      </React.Fragment>
    )
  }
}
