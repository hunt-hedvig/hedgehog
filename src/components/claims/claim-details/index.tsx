import Grid from '@material-ui/core/Grid'
import gql from 'graphql-tag'
import * as React from 'react'
import { Query, Mutation } from 'react-apollo'

import { ClaimEvents } from './components/ClaimEvents'
import { ClaimInformation } from './components/ClaimInformation'
import { ClaimNotes } from './components/ClaimNotes'
import { ClaimPayments } from './components/ClaimPayments'
import { ClaimType, TYPE_FRAGMENT } from './components/ClaimType'
import { MemberInformation } from './components/MemberInformation'
import { FileUpload } from './components/FileUpload'
import { Table, Image } from 'semantic-ui-react'
import actions from 'store/actions'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'

const CLAIM_FILES_QUERY = gql`
  query ClaimFilesQuery($id: ID!) {
    claim(id: $id) {
      claimFiles {
        claimFileId
        fileUploadUrl
        markedAsDeleted
        category
      }
    }
  }
`

const MARK_CLAIM_FILE_AS_DELETED = gql`
  mutation markClaimFileAsDeleted($claimId: ID!, $claimFileId: ID!) {
    markClaimFileAsDeleted(claimId: $claimId, claimFileId: $claimFileId)
  }
`

const SET_CLAIM_FILE_CATEGORY = gql`
  mutation setClaimFileCategory(
    $claimId: ID!
    $claimFileId: ID!
    $category: String
  ) {
    setClaimFileCategory(
      claimId: $claimId
      claimFileId: $claimFileId
      category: $category
    )
  }
`

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

interface ClaimFiles {
  claimFileId: string
  fileUploadUrl: string
  markedAsDeleted: boolean
  category: string
}

const handleSelect = (event, mutation, claimFileId, claimId) => {
  mutation({
    variables: {
      claimId: claimId,
      claimFileId: claimFileId,
      category: event.target.value,
    },
  })
}

interface State {
  confirmed: boolean
}

export class DeleteButton extends React.Component<
{
  claimId: string
  claimFileId: string
  showNotification: (data: any) => void
}, State> {
  public state = {
    confirmed: false,
  }

  public render() {
    return (
      <Mutation
        mutation={MARK_CLAIM_FILE_AS_DELETED}
        refetchQueries={() => [
          {
            query: CLAIM_FILES_QUERY,
            variables: {
              id: this.props.claimId,
            },
          },
        ]}
      >
        {(mutation, { loading }) => (
          <>
            {!this.state.confirmed ? (
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  this.toggleConfirmed()
                }}
                disabled={loading}
              >
                Delete
              </Button>
            ) : (
              <Button
                disabled={loading}
                onClick={() => this.handleClick(mutation)}
              >
                Are you sure?
              </Button>
            )}
          </>
        )}
      </Mutation>
    )
  }

  private handleClick = (mutation) => {
    mutation({
      variables: {
        claimId: this.props.claimId,
        claimFileId: this.props.claimFileId,
      },
    })
      .then(() => {
        this.props.showNotification({
          message: 'file has been marked as deleted',
          header: 'Success',
          type: 'olive',
        })
        this.resetConfirmed()
      })
      .catch((error) => {
        this.props.showNotification({
          message: error.message,
          header: 'Error',
          type: 'red',
        })
      }
    )
  }

  private resetConfirmed = () => this.setState({ confirmed: false })

  private toggleConfirmed = () =>
    this.setState((state) => ({ confirmed: !state.confirmed }))
}


class ClaimFileTableComponent extends React.Component<
  {
    claimFiles: Array<ClaimFiles>
    claimId: string
    showNotification: (data: any) => void
  }> {
  public render() {
    return (
      <>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Claim Files</Table.HeaderCell>
              <Table.HeaderCell>File Type</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {[...this.props.claimFiles].map((claimFile) => {
              if (claimFile.markedAsDeleted === false) {
                return (
                  <Table.Row key={claimFile.fileUploadUrl}>
                    <Table.Cell>
                      <Image src={claimFile.fileUploadUrl} size="medium" />
                    </Table.Cell>
                    <Table.Cell>
                      <Mutation mutation={SET_CLAIM_FILE_CATEGORY}>
                        {(mutation) => {
                          return (
                            <select
                              class="ui fluid search dropdown"
                              multiple=""
                              onChange={() =>
                                handleSelect(
                                  event,
                                  mutation,
                                  claimFile.claimFileId,
                                  this.props.claimId
                                )
                              }
                            >
                              <option>
                                {claimFile.category != null
                                  ? claimFile.category
                                  : 'File Type'}
                              </option>
                              <option>Reciept</option>
                              <option>Proof of ownership</option>
                              <option>Police report</option>
                              <option>Invoice</option>
                              <option>Proof of damage</option>
                              <option>Other</option>
                            </select>
                          )
                        }}
                      </Mutation>
                    </Table.Cell>
                    <Table.Cell>
                      <DeleteButton claimId={this.props.claimId} 
                      claimFileId={claimFile.claimFileId}
                      showNotification={this.props.showNotification}/>
                    </Table.Cell>
                  </Table.Row>
                )
              }
            })}
          </Table.Body>
        </Table>
      </>
    )
  }
}

const mapActions = { ...actions.notificationsActions }

export const ClaimFileTable = connect(
  null,
  mapActions,
)(ClaimFileTableComponent)

const ClaimPage: React.SFC<Props> = ({ match }) => (
  <>
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
          coveringEmployee,
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
                coveringEmployee={coveringEmployee}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <ClaimType type={type} claimId={match.params.id} />
            </Grid>
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
              <Query
                query={CLAIM_FILES_QUERY}
                variables={{ id: match.params.id }}
              >
                {({ loading, error, data, refetch }) => {
                  if (error) {
                    return (
                      <div>
                        Error in GraphQl query here.....:{' '}
                        <pre>{JSON.stringify(error, null, 2)}</pre>
                      </div>
                    )
                  }
                  if (loading || !data) {
                    return <div>Loading...</div>
                  }
                  return data.claim.claimFiles === 0 ? (
                    <div>
                      No claim documents have been uploaded for this claim
                    </div>
                  ) : (
                    <>
                      <Grid item xs={12}>
                        <ClaimFileTable
                          claimFiles={data.claim.claimFiles}
                          claimId={match.params.id}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FileUpload
                          claimId={match.params.id}
                          memberId={data.claim.memberId}
                          onUploaded={() => refetch}
                        />
                      </Grid>
                    </>
                  )
                }}
              </Query>
            </Grid>
            <Grid item xs={12}>
              <ClaimEvents events={events} />
            </Grid>
          </Grid>
        )
      }}
    </Query>
  </>
)

export default ClaimPage
