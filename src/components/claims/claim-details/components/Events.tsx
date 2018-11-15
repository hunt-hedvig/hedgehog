import * as React from 'react'
import { List, ListItem } from '@material-ui/core';
import { parse, format } from 'date-fns'
import { CustomPaper } from './Styles'

interface Props {
  events: Array<{
    text: string
    date: string
  }>
}

const Events: React.SFC<Props> = ({ events }) => (
  <CustomPaper>
    <h3>Events</h3>
    <List>
      {events.map(event => (
        <ListItem key={event.date}>
          {format(parse(event.date), 'YYYY-MM-DD hh:mm:ss')}: {event.text}
        </ListItem>
      ))}
    </List>
  </CustomPaper>
)

export { Events }
