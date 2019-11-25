import gql from 'graphql-tag'
import * as React from 'react'
import { Mutation } from 'react-apollo'

import { Button } from 'semantic-ui-react'

const CLAIM_FILES_QUERY = gql`
  query ClaimFilesQuery($id: ID!) {
    claim(id: $id) {
      claimFiles {
        claimFileId
        fileUploadUrl
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

interface State {
  confirmed: boolean
}

export class DeleteButton extends React.Component<
  {
    claimId: string
    claimFileId: string
    showNotification: (data: any) => void
  },
  State
> {
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
          message: 'File has been deleted',
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
      })
  }

  private resetConfirmed = () => this.setState({ confirmed: false })

  private toggleConfirmed = () =>
    this.setState((state) => ({ confirmed: !state.confirmed }))
}
