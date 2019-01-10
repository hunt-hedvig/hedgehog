import {
  List as MuiList,
  ListItem as MuiListItem,
  withStyles,
} from '@material-ui/core'
import format from 'date-fns/format'
import toDate from 'date-fns/toDate'
import * as React from 'react'
import { Paper } from '../../../shared/Paper'

interface Props {
  events: ReadonlyArray<{
    text: string
    date: string
  }>
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
      {events.map((event) => (
        <ListItem key={event.date}>
          {format(toDate(event.date), 'yyyy-MM-dd hh:mm:ss')}: {event.text}
        </ListItem>
      ))}
    </MuiList>
  </Paper>
)
