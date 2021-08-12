import { useClaimPageQuery } from 'api/generated/graphql'
import { PaperTitle } from 'components/claims/claim-details/components/claim-items/PaperTitle'
import { format, parseISO } from 'date-fns'
import { CardContent } from 'hedvig-ui/card'
import { List, ListItem } from 'hedvig-ui/list'
import { Spinner } from 'hedvig-ui/sipnner'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'

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
      <PaperTitle
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
