import { ScrollList } from 'components/shared'
import * as moment from 'moment'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Header, List, Segment } from 'semantic-ui-react'

const EventsLog = ({ events }) => (
  <Segment>
    <Header>Events log</Header>
    <ScrollList selection>
      {events.map((event, id) => (
        <List.Item key={event.id || id}>
          <List.Content floated="left">
            {moment(event.date).format('HH:mm DD MMMM YYYY')}
          </List.Content>
          <List.Content floated="right">{event.text}</List.Content>
        </List.Item>
      ))}
    </ScrollList>
  </Segment>
)

EventsLog.propTypes = {
  events: PropTypes.array.isRequired,
}

export default EventsLog
