import { useBackfillSubscriptionsMutation } from 'api/generated/graphql'
import { Button } from 'hedvig-ui/button'
import React from 'react'
import { toast } from 'react-hot-toast'
import { withShowNotification } from 'utils/notifications'

const BackfillSubscriptionsButtonComponent: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const [
    backfillSubscriptions,
    { loading },
  ] = useBackfillSubscriptionsMutation()

  return (
    <Button
      variation="primary"
      loading={loading}
      onClick={() => {
        if (!window.confirm('Are you sure? (Have you talked to Elvin?)')) {
          return
        }

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
      }}
    >
      Backfill All Subscriptions
    </Button>
  )
}

export const BackfillSubscriptionsButton = withShowNotification(
  BackfillSubscriptionsButtonComponent,
)
