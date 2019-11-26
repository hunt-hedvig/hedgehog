import Grid from '@material-ui/core/Grid'
import { QueryType } from 'api/generated/graphql'
import gql from 'graphql-tag'
import * as React from 'react'
import { Query } from 'react-apollo'

import { ClaimEvents } from './components/ClaimEvents'
import { ClaimInformation } from './components/ClaimInformation'
import { ClaimItemDatabase } from './components/inventory/ClaimItemDatabase'
import { ClaimNotes } from './components/ClaimNotes'
import { ClaimPayments } from './components/ClaimPayments'
import { ClaimType, TYPE_FRAGMENT } from './components/ClaimType'
import { MemberInformation } from './components/MemberInformation'
import { FileUpload } from './components/FileUpload'
import { ClaimFileTable } from './components/ClaimFileTable'

const CLAIM_PAGE_QUERY = gql`
  query ClaimPage($id: ID!) {
    claim(id: $id) {
      member {
        memberId
        signedOn
        firstName
        lastName
        personalNumber
        address
        postalNumber
        city
        directDebitStatus {
          activated
        }
        fraudulentStatus
        sanctionStatus
        numberFailedCharges {
          numberFailedCharges
          lastFailedChargeAt
        }
        account {
          totalBalance
        }
      }
      registrationDate
      recordingUrl
      state
      type {
        ${TYPE_FRAGMENT}
      }
      notes {
        text
        date
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
      claimFiles {
        claimFileId
        fileUploadUrl
        uploadedAt
        category
        contentType
      }
      coveringEmployee
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
  <Query<Pick<QueryType, 'claim'>>
    query={CLAIM_PAGE_QUERY}
    variables={{ id: match.params.id }}
  >
    {({ loading, error, data, refetch }) => {
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
        coveringEmployee,
        claimFiles,
      } = data!.claim!

      return (
        <Grid container spacing={8}>
          <Grid item xs={12} sm={12} md={4}>
            <MemberInformation member={member!} />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <ClaimInformation
              recordingUrl={recordingUrl}
              registrationDate={registrationDate}
              state={state}
              claimId={match.params.id}
              coveringEmployee={coveringEmployee}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <ClaimType type={type} claimId={match.params.id} />
          </Grid>
          <ClaimItemDatabase type={type} claimId={match.params.id} />
          <Grid item xs={12}>
            <ClaimNotes notes={notes} claimId={match.params.id} />
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
            <>
              <Grid item xs={12}>
                <FileUpload
                  claimId={match.params.id}
                  memberId={member.memberId}
                  onUploaded={() => refetch()}
                />
              </Grid>
              <Grid item xs={12}>
                <ClaimFileTable
                  claimFiles={claimFiles}
                  claimId={match.params.id}
                />
              </Grid>
            </>
          </Grid>
          <Grid item xs={12}>
            <ClaimEvents events={events} />
          </Grid>
        </Grid>
      )
    }}
  </Query>
)

export default ClaimPage
