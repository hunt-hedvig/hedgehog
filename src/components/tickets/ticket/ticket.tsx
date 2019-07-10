import { colors } from '@hedviginsurance/brand'
import React from 'react'
import styled from 'react-emotion'
import { Button, Popup } from 'semantic-ui-react'
import { lookupTeamMemberName } from '../../../features/taskmanager/types'
import { ITicket } from '../types'
import { CALL_ME, CLAIM, MESSAGE, OTHER, REMIND } from './icons'
import TicketBody from './ticketBody'

const typeIcons = {
  CLAIM,
  MESSAGE,
  REMIND,
  CALL_ME,
  OTHER,
}

const Card = styled('div')({
  border: '1px black gray',
  boxShadow: '3px 3px 10px rgba(0,0,0,0.2)',
  margin: '10px auto',
  padding: '1em 1em',
  background: 'white',
  borderRadius: '3px',
  maxWidth: '800px',
})

const Blob = styled('span')`
  min-width: 10px,
  margin: 10px;
  padding: 1em 1em;
  background: white;
  border-radius: 12%;
  background-color: ${(props) => {
    if (props.color >= 0.66) {
      return colors.PINK
    } else if (props.color > 0.33 && props.color < 0.66) {
      return 'moccasin'
    } else if (props.color < 0.33) {
      return 'lightgreen'
    } else {
      return 'seashell'
    }
  }};
`

const FlexWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-evenly',
  alignContent: 'space-between',
  alignItems: 'baseline',
})

class Ticket extends React.Component<ITicket, {}> {
  public state = {
    showBody: false,
  }

  public render() {
    return (
      <Card>
        <FlexWrapper>
          <span>
            {/* <strong>Type:</strong> */}
            <Popup
              content={'ticket type: ' + this.props.type.toLowerCase()}
              trigger={
                <Blob color={this.props.type}>
                  {this.getTypeIcon(this.props.type)}
                </Blob>
              }
            />
          </span>

          <span>
            {/* <strong>Priority:</strong> */}
            <Blob color={this.props.priority} />
          </span>
          <span>
            <strong>Assigned to:</strong>
            <Blob color={'seashell'}>
              {lookupTeamMemberName(this.props.assignedTo)}
            </Blob>
          </span>

          {this.props.reminder && this.props.reminder.date ? (
            <span>
              <strong>Remind:</strong>
              <Blob color={this.props.assignedTo}>
                {getNotificationTimeInWords(this.props.reminder.date)}
              </Blob>
            </span>
          ) : null}

          <Button
            onClick={(event) => this.toggleShowBody(event)}
            size="medium"
            compact
          >
            Show details
          </Button>
        </FlexWrapper>
        {this.state.showBody ? (
          <TicketBody
            description={this.props.description}
            assignedTo={this.props.assignedTo}
            status={this.props.status}
            id={this.props.id}
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

// TODO: Fix this
const getNotificationTimeInWords = (dateTime) => {
  return dateTime
}

export default Ticket
