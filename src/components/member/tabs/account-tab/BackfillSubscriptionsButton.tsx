import { Button } from '@hedvig-ui'
import { useBackfillSubscriptionsMutation } from 'api/generated/graphql'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useConfirmDialog } from 'utils/hooks/modal-hook'

export const BackfillSubscriptionsButton: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const [
    backfillSubscriptions,
    { loading },
  ] = useBackfillSubscriptionsMutation()
  const { confirm } = useConfirmDialog()

  return (
    <Button
      variation="primary"
      loading={loading}
      onClick={() => {
        confirm('Are you sure? (Have you talked to Elvin?)').then(() => {
          toast.promise(
            backfillSubscriptions({
              variables: { memberId },
            }),
            {
              loading: 'Backfilling',
              success: 'Subscriptions backfilled',
              error: 'Could not backfill subscriptions',
            },
          )
        })
      }}
    >
      Backfill All Subscriptions
    </Button>
  )
}
