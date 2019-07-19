import format from 'date-fns/format'
import React from 'react'
import styled from 'react-emotion'
import { Button, Divider, Icon, Segment } from 'semantic-ui-react'
import {
  createOptionsArray,
  IEX_TEAM_MEMBERS,
  lookupStatus,
  TICKET_STATUS,
} from '../../../features/taskmanager/types'
import Notification from '../../notifications/Notification'
import { IRemindNotification } from '../types'
import AssignTicketToMutation from './edit-ticket-mut/assignTo'
import ChangeDescriptionMutation from './edit-ticket-mut/description'
import ChangeReminderMutation from './edit-ticket-mut/reminder'
import ChangeStatusMutation from './edit-ticket-mut/status'

const teamOptions = createOptionsArray(IEX_TEAM_MEMBERS)
const statusOptions = createOptionsArray(TICKET_STATUS)

const TicketBodyCss = styled('div')`
  padding: 1em;
  margin: 1em;
  border: 1px lightgray solid;
`

interface ITicketBody {
  id: string
  assignedTo: string
  status: string
  description: string
  reminder: IRemindNotification
}

interface ITicketBodyState {
  inputs: {
    description: string
    assignedTo: string
    remindDate: any
    remindTime: any
    remindMessage: string
    status: string
  }
  notification: {
    show: boolean
    message: string
  }
  showEditTicket: boolean
}

class TicketBody extends React.Component<ITicketBody, ITicketBodyState> {
  public state = {
    inputs: {
      description: this.props.description,
      assignedTo: this.props.assignedTo,
      status: this.props.status,
      remindDate: format(new Date(), 'yyyy-MM-dd'),
      remindTime: format(new Date(), 'HH:mm:ss'),
      remindMessage: '',
    },
    notification: {
      show: false,
      message: '',
    },
    showEditTicket: false,
  }

  public render() {
    const editTicket = (
      <Segment.Group>
        <Segment color="grey" compact>
          <strong>Edit Ticket</strong>
        </Segment>

        <ChangeDescriptionMutation
          id={this.props.id}
          showNotification={this.showNotification}
          description={this.state.inputs.description}
          handleChange={this.handleChange}
        />

        <Divider horizontal> </Divider>

        <AssignTicketToMutation
          id={this.props.id}
          showNotification={this.showNotification}
          handleChange={this.handleOptionChange}
          options={teamOptions}
          assignedTo={this.state.inputs.assignedTo}
          currentlyAssignedTo={this.props.assignedTo}
        />

        <Divider horizontal> </Divider>

        <ChangeStatusMutation
          id={this.props.id}
          status={this.state.inputs.status}
          showNotification={this.showNotification}
          handleChange={this.handleOptionChange}
          options={statusOptions}
          currentStatus={this.props.status}
        />

        <Divider horizontal> </Divider>

        <ChangeReminderMutation
          id={this.props.id}
          remindDate={this.state.inputs.remindDate}
          remindTime={this.state.inputs.remindTime}
          remindMessage={this.state.inputs.remindMessage}
          handleChange={this.handleChange}
          showNotification={this.showNotification}
          currentReminder={this.props.reminder}
        />
      </Segment.Group>
    )

    const ticketInfo = (
      <Segment.Group>
        <Segment color="grey" compact>
          <strong>Description</strong>
        </Segment>
        <Segment compact textAlign="left">
          {this.props.description}
        </Segment>
        <Segment compact>Status: {lookupStatus(this.props.status)} </Segment>
      </Segment.Group>
    )

    return (
      <TicketBodyCss>
        {this.state.showEditTicket ? editTicket : ticketInfo}
        <Button
          labelPosition="left"
          icon
          onClick={(event) => this.toggleEditTicket(event)}
          basic
          toggle
          active={this.state.showEditTicket}
        >
          <Icon name="pencil alternate" />
          {this.state.showEditTicket ? 'Close Edit' : 'Open Edit'}
        </Button>
        {this.state.notification.show ? (
          <Notification
            closeHandler={(id) => this.closeNotification()}
            content={{
              header: 'Success!',
              id: 'confirmation',
              message: this.state.notification.message,
              type: 'green',
            }}
          />
        ) : null}
      </TicketBodyCss>
    )
  }

  private showNotification = (message: string): void => {
    const updateNotification = { ...this.state.notification }
    updateNotification.message = message
    updateNotification.show = true
    this.setState({ notification: updateNotification })
  }

  private closeNotification = () => {
    const notification = { ...this.state.notification }
    notification.show = false
    notification.message = ''
    this.setState({ notification })
  }

  private toggleEditTicket = (event) => {
    event.preventDefault()
    this.closeNotification()
    const updatedState = !this.state.showEditTicket
    this.setState({ showEditTicket: updatedState })
  }

  private handleOptionChange = (id: string, value: string): void => {
    const inputs = { ...this.state.inputs }
    inputs[id] = value
    this.setState({ inputs })
  }

  private handleChange = (event) => {
    const inputs = { ...this.state.inputs }
    inputs[event.target.name] = event.target.value
    this.setState({ inputs })
  }
}

export default TicketBody
