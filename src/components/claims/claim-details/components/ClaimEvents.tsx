import {
  List as MuiList,
  ListItem as MuiListItem,
  withStyles,
} from '@material-ui/core'
import { Claim } from 'api/generated/graphql'
import { format, parseISO } from 'date-fns'
import React from 'react'
import { Paper } from '../../../shared/Paper'

interface Props {
  events: NonNullable<Claim['events']>
}

const ListItem = withStyles({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
    borderBottom: '1px solid rgba(0,0,0,0.08)',
  },
})(MuiListItem)

export const ClaimEvents: React.SFC<Props> = ({ events }) => (
  <Paper>
    <h3>Events</h3>
    <MuiList>
      {events.filter(Boolean).map((event) => (
        <ListItem key={event!.date}>
          {format(parseISO(event!.date), 'yyyy-MM-dd hh:mm:ss')}: {event!.text}
        </ListItem>
      ))}
    </MuiList>
  </Paper>
)
