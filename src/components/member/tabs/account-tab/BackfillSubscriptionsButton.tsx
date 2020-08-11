import { useBackfillSubscriptionsMutation } from 'api/generated/graphql'
import { Button } from 'hedvig-ui/button'
import React from 'react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'

const BackfillSubscriptionsButtonComponent: React.FC<{
  memberId: string
} & WithShowNotification> = ({ memberId, showNotification }) => {
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

        backfillSubscriptions({
          variables: { memberId },
        })
          .then(() => {
            showNotification({
              message: 'Member subscriptions backfilled.',
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
      }}
    >
      Backfill All Subscriptions
    </Button>
  )
}

export const BackfillSubscriptionsButton = withShowNotification(
  BackfillSubscriptionsButtonComponent,
)
