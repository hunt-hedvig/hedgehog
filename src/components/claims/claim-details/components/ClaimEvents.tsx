import {
  List as MuiList,
  ListItem as MuiListItem,
  withStyles,
} from '@material-ui/core'
import { useClaimEventsQuery } from 'api/generated/graphql'
import { Paper } from 'components/shared/Paper'
import { format, parseISO } from 'date-fns'
import { Spinner } from 'hedvig-ui/sipnner'
import React from 'react'

interface Props {
  claimId: string
}

const ListItem = withStyles({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
    borderBottom: '1px solid rgba(0,0,0,0.08)',
  },
})(MuiListItem)

export const ClaimEvents: React.FC<Props> = ({ claimId }) => {
  const {
    data: claimEventsData,
    loading: loadingClaimEvents,
  } = useClaimEventsQuery({
    variables: { claimId },
  })

  return (
    <Paper>
      <h3>Events</h3>

      {loadingClaimEvents && <Spinner />}
      <MuiList>
        {claimEventsData?.claim?.events.filter(Boolean).map((event) => (
          <ListItem key={event.date}>
            {format(parseISO(event.date), 'yyyy-MM-dd HH:mm:ss')}: {event.text}
          </ListItem>
        ))}
      </MuiList>
    </Paper>
  )
}
