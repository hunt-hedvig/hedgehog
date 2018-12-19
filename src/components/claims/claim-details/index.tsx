import Grid from '@material-ui/core/Grid'
import gql from 'graphql-tag'
import * as React from 'react'
import { Query } from 'react-apollo'

import { ClaimInformation } from './components/ClaimInformation'
import { ClaimPayments } from './components/ClaimPayments'
import { ClaimType, TYPE_FRAGMENT } from './components/ClaimType'
import { Events } from './components/Events'
import { MemberInformation } from './components/MemberInformation'
import { Notes } from './components/Notes'

const CLAIM_PAGE_QUERY = gql`
  query ClaimPage($id: ID!) {
    claim(id: $id) {
      member {
        firstName
        lastName
        personalNumber
        address
        postalNumber
        city
        directDebitStatus {
          activated
        }
        sanctionStatus
      }
      registrationDate
      recordingUrl
      state
      type {
        ${TYPE_FRAGMENT}
      }
      notes {
        text
      }
      reserves
      payments {
        id
        amount
        deductible
        note
        timestamp
        exGratia
        type
        #transaction {
        #  status
        #}
        status
      }
      events {
        text
        date
      }
      __typename
    }
  }
`

interface Props {
  match: {
    params: {
      id: string
    }
  }
}

const ClaimPage: React.SFC<Props> = ({ match }) => (
  <Query query={CLAIM_PAGE_QUERY} variables={{ id: match.params.id }}>
    {({ loading, error, data }) => {
      if (loading) {
        return <div>Loading</div>
      }

      if (error) {
        return (
          <div>
            Error: <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        )
      }

      const {
        member,
        recordingUrl,
        registrationDate,
        state,
        notes,
        events,
        payments,
        reserves,
        type,
      } = data.claim

      return (
        <Grid container spacing={8}>
          <Grid item xs={12} sm={12} md={4}>
            <MemberInformation member={member} />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <ClaimInformation
              recordingUrl={recordingUrl}
              registrationDate={registrationDate}
              state={state}
              claimId={match.params.id}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <ClaimType type={type} claimId={match.params.id} />
          </Grid>
          <Grid item xs={12}>
            <Notes notes={notes} claimId={match.params.id} />
          </Grid>
          <Grid item xs={12}>
            <ClaimPayments
              payments={payments}
              claimId={match.params.id}
              reserves={reserves}
              sanctionStatus={member.sanctionStatus}
            />
          </Grid>
          <Grid item xs={12}>
            <Events events={events} />
          </Grid>
        </Grid>
      )
    }}
  </Query>
)

export default ClaimPage
