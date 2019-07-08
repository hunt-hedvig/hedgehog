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
} from 'semantic-ui-react'
import {
  ASSIGN_TO,
  CHANGE_DESCRIPTION,
  CHANGE_STATUS, 
  GET_TICKETS,
  SET_REMINDER,
} from '../../../features/taskmanager/queries'
import {
  IEX_TEAM_MEMBERS,
  TICKET_STATUS,
  createOptionsArray,
} from '../../../features/taskmanager/types'
import Notification from '../../notifications/Notification'


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
    showNotification: false,
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
                  this.setState({ showNotification: true })
                  changeTicketDescription({
                    variables: {
                      id: this.props.id,
                      newDescription: this.state.inputDescription,
                    },
                  })
                }}
              >
                <Form.Field>
                  <label htmlFor="description">Edit description: </label>
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
                {this.state.showNotification ? (
                  <Notification
                    closeHandler={(id) => this.closeNotification(id)}
                    content={{
                      header: 'Success!',
                      id: 'confirmation',
                      message: 'Changed description!',
                      type: 'green',
                    }}
                  />
                ) : null}
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
                  assignTicketToTeamMember({
                    variables: {
                      ticketId: this.props.id,
                      teamMemberId: this.state.inputAssignedTo,
                    },
                  })
                }}
              >
                <Form.Field inline>
                  <label htmlFor="assign">Assign to: </label>
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
                  changeTicketStatus({
                    variables: {
                      ticketId: this.props.id,
                      newStatus: this.state.status,
                    },
                  })
                }}
              >
                <Form.Field inline>
                  <label htmlFor="status">Status: </label>
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
        <Segment compact>Status: {this.props.status} </Segment>
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

//////////////// SLASKEN

//Saved these just in case, they should not be needed....
//update={(cache, data ) => updateCache(cache, data, "changeTicketDescription")}
//update={(cache, data ) => updateCache(cache, data, "assignTicketToTeamMember")}

//Update mutated tickets in cache, keep in sync with the server
//
// const updateCache = (cache, data, query) => {
//   const mutatedTicket= data.data[query]
//   const updatedData = {...cache.data.data}
//   const updatedTicket = {...updatedData['Ticket:'+ mutatedTicket.id]}

//   //TODO: Make this more general, without need for if statements
//   if(query === "assignTicketTo"){
//     updatedTicket.assignedTo = mutatedTicket.assignedTo
//       updatedData['Ticket:'+updatedTicket.id] = mutatedTicket.assignedTo
//   }
//   else if(query === "changeTicketDescription") {
//     updatedTicket.description = mutatedTicket.description
//     updatedData['Ticket:'+updatedTicket.id] = mutatedTicket.description
//   }
//   cache.writeQuery({
//     query: GET_TICKETS,
//     data:  updatedData,
//   })
// }
