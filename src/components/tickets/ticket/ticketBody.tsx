import format from 'date-fns/format'
import React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'
import {
  Button,
  Divider,
  Dropdown,
  Form,
  Icon,
  Label,
  Segment,
  TextArea,
} from 'semantic-ui-react'
import {
  ASSIGN_TO,
  CHANGE_DESCRIPTION,
  CHANGE_REMINDER,
  CHANGE_STATUS,
} from '../../../features/taskmanager/queries'
import {
  createOptionsArray,
  IEX_TEAM_MEMBERS,
  lookupStatus,
  lookupTeamMemberName,
  TICKET_STATUS,
} from '../../../features/taskmanager/types'
import Notification from '../../notifications/Notification'
import Datepicker from './create-ticket/datepicker'

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

  // TODO: Cancel mutations:
  // componentWillUnmount() {
  // }

  public render() {
    const editTicket = (
      <Segment.Group>
        <Segment color="grey" compact>
          <em>Edit Ticket</em>
        </Segment>
        <Mutation
          mutation={CHANGE_DESCRIPTION}
          key={this.props.id + 'description'}
        >
          {(changeTicketDescription, { data }) => {
            return (
              <Form
                onSubmit={(e) => {
                  e.preventDefault()
                  this.showNotification('Success! Changed description')
                  changeTicketDescription({
                    variables: {
                      id: this.props.id,
                      newDescription: this.state.inputs.description,
                    },
                  })
                }}
              >
                <Form.Field>
                  <Label htmlFor="description">Edit description: </Label>
                  <TextArea
                    row={3}
                    col={15}
                    name="description"
                    placeholder={this.props.description}
                    value={this.state.inputs.description}
                    onChange={(e) => this.handleChange(e)}
                  />
                  <Button compact basic type="submit">
                    Change description
                  </Button>
                </Form.Field>
              </Form>
            )
          }}
        </Mutation>

        <Divider horizontal> </Divider>

        <Mutation mutation={ASSIGN_TO} key={this.props.id + 'assign'}>
          {(assignTicketToTeamMember, { data }) => {
            return (
              <Form
                onSubmit={(e) => {
                  e.preventDefault()
                  this.showNotification(
                    'Success! Assigned the ticket to: ' +
                      lookupTeamMemberName(this.state.inputs.assignedTo),
                  )
                  assignTicketToTeamMember({
                    variables: {
                      ticketId: this.props.id,
                      teamMemberId: this.state.inputs.assignedTo,
                    },
                  })
                }}
              >
                <Form.Field inline>
                  <Label htmlFor="assignedTo">Assign to: </Label>
                  <Dropdown
                    name="assignedTo"
                    placeholder="Select team member"
                    search
                    selection
                    options={teamOptions}
                    onChange={(event, {value}) => this.handleOptionChange("assignedTo", value)}
                  />
                  <Button basic type="submit" compact>
                    Assign
                  </Button>
                </Form.Field>
              </Form>
            )
          }}
        </Mutation>

        <Divider horizontal> </Divider>

        <Mutation mutation={CHANGE_STATUS} key={this.props.id + 'status'}>
          {(changeTicketStatus, { data }) => {
            return (
              <Form
                onSubmit={(e) => {
                  e.preventDefault()
                  this.showNotification(
                    'Success! Changed the status to: ' +
                      lookupStatus(this.state.inputs.status),
                  )

                  changeTicketStatus({
                    variables: {
                      ticketId: this.props.id,
                      newStatus: this.state.inputs.status,
                    },
                  })
                }}
              >
                <Form.Field inline>
                  <Label htmlFor="status">Status: </Label>
                  <Dropdown
                    name="status"
                    placeholder="Assign new status:"
                    search
                    selection
                    options={statusOptions}
                    onChange={(event, {value}) => this.handleOptionChange("status",value)}
                  />
                  <Button basic type="submit" compact>
                    Change status
                  </Button>
                </Form.Field>
              </Form>
            )
          }}
        </Mutation>

        <Divider horizontal> </Divider>

        <Mutation mutation={CHANGE_REMINDER} key={this.props.id + 'reminder'}>
          {(changeTicketReminder, { data }) => {
            return (
              <Form
                onSubmit={(e) => {
                  e.preventDefault()

                  this.showNotification(
                    'Success! Set a reminder for: ' +
                      this.state.inputs.remindDate +
                      ' ' +
                      this.state.inputs.remindTime,
                  )

                  changeTicketReminder({
                    variables: {
                      ticketId: this.props.id,
                      newReminder: {
                        date: this.state.inputs.remindDate,
                        time: this.state.inputs.remindTime,
                        message: this.state.inputs.remindMessage,
                      },
                    },
                  })
                }}
              >
                <Label htmlFor={'remindMessage'}>
                  Message for remind notification:
                </Label>
                <br />
                <TextArea
                  row={4}
                  col={20}
                  name="remindMessage"
                  placeholder="Give a short remind message (max 100 characters)"
                  value={this.state.inputs.remindMessage}
                  onChange={(e) => this.handleChange(e)}
                  maxLength={100}
                />
                <Datepicker
                  handleChange={(e) => this.handleChange(e)}
                  datepicker={{
                    name: 'remindDate',
                    value: this.state.inputs.remindDate,
                  }}
                  timepicker={{
                    name: 'remindTime',
                    value: this.state.inputs.remindTime,
                  }}
                />
                <Button basic type="submit" compact>
                  Set reminder
                </Button>
              </Form>
            )
          }}
        </Mutation>
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
          Edit
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

  private handleOptionChange = (id: string , value: string):void => {
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

