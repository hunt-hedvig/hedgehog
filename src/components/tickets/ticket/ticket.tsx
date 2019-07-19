import React from 'react'
import styled from 'react-emotion'
import { Button, Grid, Popup } from 'semantic-ui-react'
import {
  lookupTeamMemberName,
  TICKET_STATUS,
  TicketStatus,
} from '../../../features/taskmanager/types'
import { ITicket } from '../types'
import { CALL_ME, CLAIM, COMPLETED, MESSAGE, OTHER, REMIND } from './icons'
import TicketBody from './ticketBody'

import isAfter from 'date-fns/isAfter'
import isSameDay from 'date-fns/isSameDay'
import parse from 'date-fns/parse'

import ColorIndicator from './color-indicator/colorIndicator'

const typeIcons = {
  CLAIM,
  MESSAGE,
  REMIND,
  CALL_ME,
  OTHER,
  COMPLETED,
}

const Card = styled('div')({
  border: '1px black gray',
  boxShadow: '3px 3px 10px rgba(0,0,0,0.1)',
  margin: '10px auto',
  padding: '1em 1em',
  background: 'white',
  borderRadius: '3px',
  maxWidth: '800px',
  alignItems: 'baseline',
})

const HighlightedField = styled('span')`
  min-width: 10px,
  margin: 10px;
  padding: 1em 1em;
  background: white;
  border-radius: 12%;
  background-color: ${(props) => {
    return props.color
  }};
`

class Ticket extends React.Component<ITicket, {}> {
  public state = {
    showBody: false,
  }

  public render() {
    return (
      <Card>
        <Grid
          container
          divided
          stackable
          columns="equal"
          verticalAlign="middle"
        >
          <Grid.Row>
            <Grid.Column floated="left">
              <Popup
                content={'Ticket type: ' + this.props.type.toLowerCase()}
                trigger={<span>{this.getTypeIcon(this.props.type)}</span>}
              />
              {this.props.status === TicketStatus.RESOLVED ? (
                <Popup
                  content={'Ticket has been completed'}
                  trigger={this.getTypeIcon('COMPLETED')}
                />
              ) : null}
            </Grid.Column>

            <Grid.Column width={3}>
              <strong>Priority: </strong>
              <ColorIndicator percentage={this.props.priority} />
            </Grid.Column>

            <Grid.Column width={4}>
              <strong>Assigned to:</strong>
              <HighlightedField color={'seashell'}>
                {lookupTeamMemberName(this.props.assignedTo)}
              </HighlightedField>
            </Grid.Column>

            <Grid.Column width={5}>
              {this.props.reminder && this.props.reminder.date ? (
                <React.Fragment>
                  <strong>Remind:</strong>
                  <HighlightedField color={this.props.assignedTo}>
                    {getReminderTimeInWords(
                      this.props.reminder.date,
                      this.props.reminder.time,
                    )}
                  </HighlightedField>
                </React.Fragment>
              ) : null}
            </Grid.Column>

            <Grid.Column floated="right">
              <Button onClick={(event) => this.toggleShowBody(event)} compact>
                {this.state.showBody ? 'Hide details' : 'Show details'}
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {this.state.showBody ? (
          <TicketBody
            description={this.props.description}
            assignedTo={this.props.assignedTo}
            status={this.props.status}
            id={this.props.id}
            reminder={this.props.reminder}
          />
        ) : null}
      </Card>
    )
  }

  private toggleShowBody = (event) => {
    event.preventDefault()
    const updatedState = !this.state.showBody
    this.setState({ showBody: updatedState })
  }

  private getTypeIcon = (type) => {
    const icon = typeIcons[type]
    return icon
  }
}

const getReminderTimeInWords = (date, time) => {
  const now = new Date()
  const parsedDate = parse(date, 'yyyy-MM-dd', now)

  if (isSameDay(parsedDate, now)) {
    return 'today: ' + time
  } else if (isAfter(parsedDate, now)) {
    return date + ', ' + time
  } else {
    return 'has passed: ' + date
  }
}

export default Ticket
