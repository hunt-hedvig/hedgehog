import { List, ListItem } from '@material-ui/core'
import format from 'date-fns/format'
import toDate from 'date-fns/toDate'
import * as React from 'react'
import { CustomPaper } from './Styles'

interface Props {
  events: ReadonlyArray<{
    text: string
    date: string
  }>
}

const Events: React.SFC<Props> = ({ events }) => (
  <CustomPaper>
    <h3>Events</h3>
    <List>
      {events.map((event) => (
        <ListItem key={event.date}>
          {format(toDate(event.date), 'yyyy-MM-dd hh:mm:ss')}: {event.text}
        </ListItem>
      ))}
    </List>
  </CustomPaper>
)

export { Events }
