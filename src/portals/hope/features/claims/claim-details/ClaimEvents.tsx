import { CardContent, CardTitle, List, ListItem, Spinner } from '@hedvig-ui'
import { format, parseISO } from 'date-fns'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'
import gql from 'graphql-tag'
import { useClaimEventsQuery } from 'types/generated/graphql'

gql`
  query ClaimEvents($claimId: ID!) {
    claim(id: $claimId) {
      id
      events {
        text
        date
      }
    }
  }
`

export const ClaimEvents: React.FC<{ claimId: string }> = ({ claimId }) => {
  const { data, error, loading } = useClaimEventsQuery({
    variables: { claimId },
  })

  const events = data?.claim?.events ?? []

  return (
    <CardContent>
      <CardTitle
        title="Events"
        badge={
          error
            ? {
                icon: BugFill,
                status: 'danger',
                label: 'Internal Error',
              }
            : null
        }
      />

      {loading && <Spinner />}

      <List>
        {events.map((event) => (
          <ListItem key={event.date}>
            {format(parseISO(event.date), 'yyyy-MM-dd HH:mm:ss')}: {event.text}
          </ListItem>
        ))}
      </List>
    </CardContent>
  )
}
