import gql from 'graphql-tag'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'

import { Table, Image } from 'semantic-ui-react'
import actions from '../../../../store/actions'
import { connect } from 'react-redux'
import { DeleteButton } from '../components/DeleteClaimFileButton'
import { dateTimeFormatter } from '../../../../lib/helpers'
import { Dropdown } from 'semantic-ui-react'

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

const sortClaimFileDate = (a, b) => {
  const aDate = new Date(a.uploadedAt)
  const bDate = new Date(b.uploadedAt)

  return bDate - aDate
}

const NoClaimFiles = styled('div')({
  padding: '1rem',
})

const fileUploadOptions = [
  {
    key: 'Reciept',
    text: 'Reciept',
    value: 'Reciept',
  },
  {
    key: 'Proof of ownership',
    text: 'Proof of ownership',
    value: 'Proof of ownership',
  },
  {
    key: 'Police report',
    text: 'Police report',
    value: 'Police report',
  },
  {
    key: 'Invoice',
    text: 'Invoice',
    value: 'Invoice',
  },
  {
    key: 'Proof of damage',
    text: 'Proof of damage',
    value: 'Proof of damage',
  },
  {
    key: 'Other',
    text: 'Other',
    value: 'Other',
  },
]

interface ClaimFiles {
  claimFileId: string
  fileUploadUrl: string
  uploadedAt: Instant
  category: string
  contentType: string
}

class ClaimFileTableComponent extends React.Component<{
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
              <Table.HeaderCell>Uploaded At</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.claimFiles.length === 0 ? (
              <NoClaimFiles>
                No claim documents have been uploaded for this claim
              </NoClaimFiles>
            ) : (
              [...this.props.claimFiles]
                .sort(sortClaimFileDate)
                .map((claimFile) => {
                  return (
                    <Table.Row key={claimFile.fileUploadUrl}>
                      <Table.Cell>
                        {claimFile.contentType === 'application/pdf' ? (
                          <embed
                            src={claimFile.fileUploadUrl}
                            width="800px"
                            height="300px"
                          />
                        ) : (
                          <Image src={claimFile.fileUploadUrl} size="large" />
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Mutation mutation={SET_CLAIM_FILE_CATEGORY}>
                          {(mutation) => {
                            return (
                              <Dropdown
                                placeholder={
                                  claimFile.category != null
                                    ? claimFile.category
                                    : 'File Type'
                                }
                                fluid
                                selection
                                options={fileUploadOptions}
                                onChange={(event) =>
                                  mutation({
                                    variables: {
                                      claimId: this.props.claimId,
                                      claimFileId: claimFile.claimFileId,
                                      category: event.currentTarget.textContent,
                                    },
                                  })
                                }
                              />
                            )
                          }}
                        </Mutation>
                      </Table.Cell>
                      <Table.Cell>
                        {dateTimeFormatter(
                          claimFile.uploadedAt,
                          'yyyy-MM-dd HH:mm:ss',
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <DeleteButton
                          claimId={this.props.claimId}
                          claimFileId={claimFile.claimFileId}
                          showNotification={this.props.showNotification}
                        />
                      </Table.Cell>
                    </Table.Row>
                  )
                })
            )}
          </Table.Body>
        </Table>
      </>
    )
  }
}

const mapActions = { ...actions.notificationsActions }

export const ClaimFileTable = connect(null, mapActions)(ClaimFileTableComponent)
