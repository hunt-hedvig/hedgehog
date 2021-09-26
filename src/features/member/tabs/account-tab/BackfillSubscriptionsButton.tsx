import { Button } from '@hedvig-ui'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useBackfillSubscriptionsMutation } from 'types/generated/graphql'
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
      variant="secondary"
      disabled={loading}
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
      Backfill monthly premiums and discounts
    </Button>
  )
}
