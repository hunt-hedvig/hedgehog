import { useMarkClaimFileAsDeletedMutation } from 'api/generated/graphql'
import { Button } from 'hedvig-ui/button'
import React from 'react'
import { toast } from 'react-hot-toast'

export const DeleteButton: React.FC<{
  claimId: string
  claimFileId: string
  onDeleted: () => void
}> = ({ claimFileId, claimId, onDeleted }) => {
  const [
    markClaimFileAsDeleted,
    { loading },
  ] = useMarkClaimFileAsDeletedMutation()

  return (
    <>
      <Button
        disabled={loading}
        variation="danger"
        onClick={() => {
          if (window.confirm('Are you sure you want to delete this file?')) {
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
          }
        }}
      >
        Delete
      </Button>
    </>
  )
}
