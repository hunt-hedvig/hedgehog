import React from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'
import {
  Button,
  Divider,
  Dropdown,
  Form,
  Icon,
  Segment,
  TextArea,
  Label,
} from 'semantic-ui-react'
import {
  ASSIGN_TO,
  CHANGE_DESCRIPTION,
  CHANGE_REMINDER,
  CHANGE_STATUS, 
  GET_TICKETS,
} from '../../../features/taskmanager/queries'
import {
  IEX_TEAM_MEMBERS,
  TICKET_STATUS,
  createOptionsArray,
  createOptionsArrayFromObjects, 
  lookupStatus,
  lookupTeamMemberName, 
} from '../../../features/taskmanager/types'
import Notification from '../../notifications/Notification'
import Datepicker from './create-ticket/datepicker'
import format from 'date-fns/format'


const teamOptions = createOptionsArray(IEX_TEAM_MEMBERS)
const statusOptions = createOptionsArray(TICKET_STATUS)


const TicketBodyCss = styled('div')`
  padding: 1em;
  margin: 1em;
  border: 1px lightgray solid;
`

class TicketBody extends React.Component {
  public state = {
    inputDescription: this.props.description,
    inputAssignedTo: this.props.assignedTo,
    inputRemindNotificationDate: format(new Date(), 'yyyy-MM-dd'),
    inputRemindNotificationTime: format(new Date(), 'HH:mm:ss'),
    inputRemindMessage: '', 
    showNotification: false,
    notificationMessage: "", 
    status: this.props.status,
  }

  //TODO: Cancel mutations: 
  // componentWillUnmount() {
  // }

  render() {
    const editTicket = (
      <Segment.Group>
        <Segment color="grey" compact>
          <em>Edit Ticket</em>
        </Segment>
        <Mutation mutation={CHANGE_DESCRIPTION} key={this.props.id + 'description'}>
          {(changeTicketDescription, { data }) => {
            return (
              <Form
                onSubmit={(e) => {
                  e.preventDefault()
                  this.setState({ showNotification: true, notificationMessage: "Success! Changed description" })
                  changeTicketDescription({
                    variables: {
                      id: this.props.id,
                      newDescription: this.state.inputDescription,
                    },
                  })
                }}
              >
                <Form.Field>
                  <Label htmlFor="description">Edit description: </Label>
                  <TextArea
                    row={3}
                    col={15}
                    name="inputDescription"
                    placeholder={this.props.description}
                    value={this.state.inputDescription}
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
                  this.setState({ showNotification: true,
                       notificationMessage: "Success! Assigned the ticket to: " + lookupTeamMemberName(this.state.inputAssignedTo) })
                  assignTicketToTeamMember({
                    variables: {
                      ticketId: this.props.id,
                      teamMemberId: this.state.inputAssignedTo,
                    },
                  })
                }}
              >
                <Form.Field inline>
                  <Label htmlFor="assign">Assign to: </Label>
                  <Dropdown
                    name="assign"
                    placeholder="Select team member"
                    search
                    selection
                    options={teamOptions}
                    // value={this.state.inputAssignedTo}
                    onChange={(e, { value }) => {
                      this.setState({ inputAssignedTo: value })
                    }}
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
                  this.setState({ showNotification: true, 
                      notificationMessage: "Success! Changed the status to: " + lookupStatus(this.state.status)})
                  changeTicketStatus({
                    variables: {
                      ticketId: this.props.id,
                      newStatus: this.state.status,
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
                    // value={this.state.inputAssignedTo}
                    onChange={(e, { value }) => {
                      this.setState({ status: value })
                    }}
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
          { (changeTicketReminder, {data}) => {
            return (
              <Form 
                onSubmit={ e => {
                  e.preventDefault()
                  this.setState({ showNotification: true,
                       notificationMessage: "Success! Set a reminder for: " + this.state.inputRemindNotificationDate + " " + this.state.inputRemindNotificationTime })
                  changeTicketReminder({
                    variables: {
                      ticketId: this.props.id,
                      newReminder: {
                        date: this.state.inputRemindNotificationDate,
                        time: this.state.inputRemindNotificationTime,
                        message: this.state.inputRemindMessage,
                      },
                    }
                  })
                }}>
              <Label htmlFor={'remindMessage'}>Message for remind notification:</Label> 
              <br/>  
              <TextArea
                row={4}
                col={20}
                name="inputRemindMessage"
                placeholder="Give a short remind message (max 100 characters)"
                value={this.state.inputRemindMessage}
                onChange={(e) => this.handleChange(e)}
                maxLength={100}
              />
              <Datepicker 
                handleChange={ e => this.handleChange(e) }
                datepickerName="inputRemindNotificationDate"
                datepickerValue={this.state.inputRemindNotificationDate}
                timepickerName="inputRemindNotificationTime"
                timepickerValue={this.state.inputRemindNotificationTime}
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
        {
          this.state.showNotification ? (
            <Notification
                closeHandler={(id) => this.closeNotification(id)}
                content={{
                header: 'Success!',
                id: 'confirmation',
                message: this.state.notificationMessage,
                type: 'green',
              }}
            />
          ) : null
        }
      </TicketBodyCss>
    )
  }

  private closeNotification = (id) => {
    this.setState({ showNotification: false })
  }

  private toggleEditTicket = (event) => {
    event.preventDefault()
    const updatedState = !this.state.showEditTicket
    this.setState({ showEditTicket: updatedState, showNotification: false })
  }

  private handleChange = (event) => {
    event.preventDefault()
    this.setState({ [event.target.name]: event.target.value })
  }
}

export default TicketBody


