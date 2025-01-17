import { Button } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useMarkClaimFileAsDeletedMutation } from 'types/generated/graphql'
import gql from 'graphql-tag'

gql`
  mutation MarkClaimFileAsDeleted($claimId: ID!, $claimFileId: ID!) {
    markClaimFileAsDeleted(claimId: $claimId, claimFileId: $claimFileId)
  }
`

export const DeleteButton: React.FC<{
  claimId: string
  claimFileId: string
  onDeleted: () => void
}> = ({ claimFileId, claimId, onDeleted }) => {
  const [markClaimFileAsDeleted, { loading }] =
    useMarkClaimFileAsDeletedMutation()

  const { confirm } = useConfirmDialog()

  return (
    <>
      <Button
        disabled={loading}
        status="danger"
        onClick={() => {
          confirm('Are you sure you want to delete this file?').then(() => {
            toast.promise(
              markClaimFileAsDeleted({
                variables: {
                  claimId,
                  claimFileId,
                },
              }),
              {
                loading: 'Deleting file',
                success: () => {
                  onDeleted()
                  return 'File deleted'
                },
                error: 'Could not delete file',
              },
            )
          })
        }}
      >
        Delete
      </Button>
    </>
  )
}
