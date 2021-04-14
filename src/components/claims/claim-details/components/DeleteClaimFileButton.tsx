import { useMarkClaimFileAsDeletedMutation } from 'api/generated/graphql'
import { Button } from 'hedvig-ui/button'
import * as React from 'react'
import { WithShowNotification } from 'store/actions/notificationsActions'

export const DeleteButton: React.FC<WithShowNotification & {
  claimId: string
  claimFileId: string
  onDeleted: () => void
}> = ({ claimFileId, claimId, showNotification }) => {
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
            markClaimFileAsDeleted({
              variables: {
                claimId: claimId,
                claimFileId: claimFileId,
              },
            })
              .then(() => {
                showNotification({
                  message: 'File has been deleted',
                  header: 'Success',
                  type: 'olive',
                })
              })
              .catch((error) => {
                showNotification({
                  message: error.message,
                  header: 'Error',
                  type: 'red',
                })
                throw error
              })
          }
        }}
      >
        Delete
      </Button>
    </>
  )
}
