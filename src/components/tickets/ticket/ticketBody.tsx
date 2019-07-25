import format from 'date-fns/format'
import React from 'react'
import styled from 'react-emotion'
import { Button, Divider, Icon, Segment } from 'semantic-ui-react'
import {
  createOptionsArray,
  IEX_TEAM_MEMBERS_OPTIONS,
  lookupStatus,
  TICKET_STATUS,
  TicketStatus,
} from '../../../features/taskmanager/types'
import { IRemindNotification } from '../types'
import AssignTicketToMutation from './edit-ticket-mut/assignTo'
import ChangeDescriptionMutation from './edit-ticket-mut/description'
import ChangeReminderMutation from './edit-ticket-mut/reminder'
import ChangeStatusMutation from './edit-ticket-mut/status'

const teamOptions = createOptionsArray(IEX_TEAM_MEMBERS_OPTIONS)
const statusOptions = createOptionsArray(TICKET_STATUS)

const TicketBodyCss = styled('div')`
  padding: 1em;
  margin: 1em;
  border: 1px lightgray solid;
`

interface ITicketBody {
  id: string
  assignedTo: string
  status: TicketStatus
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
    status: TicketStatus
    touched: {
        description: boolean
        remindDate: boolean
        remindTime: boolean
        remindMessage: boolean       
    }
  }
  showEditTicket: boolean
}

export class TicketBody extends React.Component<ITicketBody, ITicketBodyState> {
  public state = {
    inputs: {
      description: this.props.description,
      assignedTo: this.props.assignedTo,
      status: this.props.status,
      remindDate: format(new Date(), 'yyyy-MM-dd'),
      remindTime: format(new Date(), 'HH:mm:ss'),
      remindMessage: '',
      touched: {
        description: false,
        assignedTo: false,
        status: false,
        remindDate: false,
        remindTime: false,
        remindMessage: false, 
      }
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
          description={this.state.inputs.description}
          touched={this.state.inputs.touched.description}
          handleChange={this.handleChange}
          oldDescription={this.props.description}
        />

        <Divider horizontal> </Divider>

        <AssignTicketToMutation
          id={this.props.id}
          handleChange={this.handleOptionChange}
          options={teamOptions}
          assignedTo={this.state.inputs.assignedTo}
          currentlyAssignedTo={this.props.assignedTo}
        />

        <Divider horizontal> </Divider>

        <ChangeStatusMutation
          id={this.props.id}
          status={this.state.inputs.status}
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
          currentReminder={this.props.reminder}
          touchedDate ={this.state.inputs.touched.remindDate}
          touchedTime ={this.state.inputs.touched.remindTime}
          touchedMessage ={this.state.inputs.touched.remindMessage}

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
        >
          {this.state.showEditTicket ? <Icon name="close" /> : <Icon name="pencil alternate" /> } 
          {this.state.showEditTicket ? 'Close Edit' : 'Open Edit'}
        </Button>
      </TicketBodyCss>
    )
  }

  private toggleEditTicket = (event) => {
    event.preventDefault()
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
    inputs.touched[event.target.name] = true 
    this.setState({ inputs })
  }
}