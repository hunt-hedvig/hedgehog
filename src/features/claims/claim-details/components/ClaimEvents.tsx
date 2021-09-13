import { CardContent, CardTitle, List, ListItem, Spinner } from '@hedvig-ui'
import { format, parseISO } from 'date-fns'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { useClaimPageQuery } from 'types/generated/graphql'

export const ClaimEvents: React.FC<{ claimId: string }> = ({ claimId }) => {
  const {
    data: claimEventsData,
    loading: loadingClaimEvents,
    error: queryError,
  } = useClaimPageQuery({
    variables: { claimId },
  })

  return (
    <CardContent>
      <CardTitle
        title={'Events'}
        badge={
          queryError
            ? {
                icon: BugFill,
                status: 'danger',
                label: 'Internal Error',
              }
            : null
        }
      />

      {loadingClaimEvents && <Spinner />}

      <List>
        {claimEventsData?.claim?.events.filter(Boolean).map((event) => (
          <ListItem key={event.date}>
            {format(parseISO(event.date), 'yyyy-MM-dd HH:mm:ss')}: {event.text}
          </ListItem>
        ))}
      </List>
    </CardContent>
  )
}
