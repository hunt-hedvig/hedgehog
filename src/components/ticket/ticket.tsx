import { colors } from '@hedviginsurance/brand'
import React from 'react'
import styled from 'react-emotion'
import  gql  from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { GET_TICKETS } from '../../features/taskmanager/index'
import { Dropdown, TextArea} from 'semantic-ui-react'
import dateFnsFormat from 'date-fns/format'



const Card = styled('div')({
  border: '1px black gray',
  boxShadow: '3px 3px 10px gray',
  margin: '10px auto',
  padding: '1em 1em',
  background: 'white',
  borderRadius: '3px',
  maxWidth: '800px',
})

const TicketBody = styled('div')`
  padding: 1em;
  margin: 1em;
  border: 1px lightgray solid;
`

const Blob = styled('span')`
  margin: 10px;
  padding: 1em 1em;
  background: white;
  border-radius: 100%;
  background-color: ${ props => {
    if(props.color == 'HIGH'){
      return colors.PINK
    }
    else if(props.color == 'MEDIUM'){
     return 'moccasin' 
    }
   else if(props.color == 'LOW'){
     return 'lightgreen' 
    }
    else {
     return 'lightgray' 
    }
  }};
`

const Button = styled('button')({
  background: colors.WHITE,
  border: 'none',
  cursor: 'pointer',
  padding: '0.75em',
  borderRadius: '3px',
  font: 'inherit',
  boxShadow: '2px 2px 10px lightgray',
})

const FlexWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-evenly',
  alignContent: 'space-between',
  alignItems: 'baseline',
})

const CHANGE_DESCRIPTION = gql`
  mutation ChangeDescription($id : ID!, $newDescription: String) {
    changeTicketDescription(id: $id, newDescription: $newDescription) {
      id
      description
    }
  }
`
const ASSIGN_TO = gql`
  mutation AssignTicketTo ($ticketId: ID!, $teamMemberId: ID!) {
    assignTicketToTeamMember(ticketId: $ticketId, teamMemberId: $teamMemberId) {
      id
      assignedTo
    }
  }
`

const SET_REMINDER = gql`
  mutation SetReminderDate ($ticketId: ID!, $remindNotificationDate: LocalDate ) {
    setReminderDate (ticketId: $ticketId, remindNotificationDate: $rremindNotificationDate) {
      id
      remindDateNotifcationDate
    }
  }
`

const selectTeamOptions = [
  {
    text: 'Team Member1',
    value: 'TeamMember1',
  },
  {
    text: 'Team Member2',
    value: 'TeamMember2',
  },
  {
    text: 'Team Member3',
    value: 'TeamMember3',
  },
  {
    text: 'Team Member4',
    value: 'TeamMember4',
  },
  {
    text: 'Team Member5',
    value: 'TeamMember5',
  },
   {
    text: 'Unassigned',
    value: 'Unassigned',
  },
]

//Update mutated tickets in cache, keep in sync with the server
// FIX FOR ASSIGN_TO !!!
const updateCache = (cache, data, query) => {
  const mutatedTicket= data.data[query]
  const updatedData = {...cache.data.data}
  const updatedTicket = {...updatedData['Ticket:'+ mutatedTicket.id]}

  //TODO: Make this more general, without need for if statements
  if(query === "assignTicketTo"){
    updatedTicket.assignedTo = mutatedTicket.assignedTo
      updatedData['Ticket:'+updatedTicket.id] = mutatedTicket.assignedTo
  }
  else if(query === "changeTicketDescription") {
    updatedTicket.description = mutatedTicket.description
    updatedData['Ticket:'+updatedTicket.id] = mutatedTicket.description
  }
  cache.writeQuery({
    query: GET_TICKETS,
    data:  updatedData,
  })
} 

const setTime = () => dateFns.format( new Date(), 'HH:mm')
const setDate = () => dateFns.format( new Date(), 'MM-DD-YYYY')
const createDateTime = (date, time) =>{
  return date.toString() + 'T' + time.toString() 
} 

class Ticket extends React.Component {
  public state = {
    showBody: false,
    inputDescription: this.props.description,
    inputAssignedTo: this.props.assignedTo,
    inputReminderTime: setTime(),
    inputReminderDate: setDate(), 
  }

  public render() {
    const ticketBody = (
      <TicketBody>
        <p>Description: {this.props.description}</p>
        <p>Status: {this.props.status}</p>
           <Mutation mutation={CHANGE_DESCRIPTION} update={(cache, data ) => updateCache(cache, data, "changeTicketDescription")}>
          {
          ( changeTicketDescription, { data } ) => {
            return ( 
              <React.Fragment>
              <form onSubmit ={(e) => {
                e.preventDefault()
                changeTicketDescription({ variables: { id: this.props.id, newDescription: this.state.inputDescription} })}
              }>
                <label htmlFor="description">Edit description: </label>
                <TextArea 
                  row={3} col={10} 
                  name="description"
                  placeholder={this.props.description}
                  value={this.state.inputDescription}
                  onChange={(e) => this.handleChange(e, "inputDescription")}
                   />
                <Button type="submit">Change description</Button>
              </form>
              </React.Fragment>
            )
          } 
        }
        </Mutation>
          <Mutation mutation={ASSIGN_TO} update={(cache, data ) => updateCache(cache, data, "assignTicketToTeamMember")}>
          {
          ( assignTicketToTeamMember, { data } ) => {
            return ( 
              <React.Fragment>
              <form onSubmit ={(e) => {
                e.preventDefault()
                assignTicketToTeamMember({ variables: { ticketId: this.props.id, teamMemberId: this.state.inputAssignedTo }})}
              }>
                <label htmlFor="assign">Assign to Team Member: </label>
                 <Dropdown 
                   name="assign"
                   placeholder="Select team member"
                   search
                   selection
                   options={selectTeamOptions}
                   // value={this.state.inputAssignedTo}
                   onChange={(e, { value }) => {
                     this.setState({ inputAssignedTo: value })
                                      }}
                   />
                <Button type="submit">Assign</Button>
              </form>
              </React.Fragment>
            )
          } 
        }
        </Mutation>
     
         <Mutation mutation={SET_REMINDER} update={(cache, data ) => updateCache(cache, data, "setReminderDate")}>
          {
          ( setReminderDate, { data } ) => {
            return ( 
              <React.Fragment>
              <form onSubmit ={(e) => {
                e.preventDefault()
                setReminderDate({ variables: { 
                   ticketId: this.props.id,
                   remindNotificationDate: createDateTime(this.state.inputDate, this.state.inputTime) 
                 }})}}
              >
                <label htmlFor="reminder">Set Reminder</label>
                 <input
                  name="date"
                  type="date"
                  value={this.state.inputDate}
                  onChange={(event) => this.setState({inputDate: event.target.value}) } />
                <label htmlFor="time">Time: </label>
                <input
                  name="time"
                  type="time"
                  value={this.state.inputTime}
                  onChange={(event) => this.setState({inputDate: event.target.value})} />
                <Button type="submit">Set Reminder</Button>
              </form>
              </React.Fragment>
            )
          } 
        }
        </Mutation>


      </TicketBody>
    )
    const bookIcon = <i className={"fas fa-book-open"}></i>

    return (
      <Card>
        <FlexWrapper>
        <span>
          <strong>Type:</strong>
          <Blob color={this.props.type}>
            {this.props.type}
          </Blob>
        </span>
        
        <span>
          <strong>Priority:</strong>
          <Blob color={this.props.priority}>
             {this.props.priority}
          </Blob>
        </span>
        <span>
          <strong>Assigned to:</strong> 
          <Blob color={this.props.assignedTo}>
            {this.props.assignedTo}
          </Blob>
        </span>

         {
          (this.props.remindNotificationDate) ?  
          <span>
            <strong>Remind:</strong> 
            <Blob color={this.props.assignedTo}>
              {this.props.remindNotificationDate}
            </Blob>
          </span>
          : null 
         }

        <Button onClick={(event) => this.toggleShowBody(event)}>
          Show details {bookIcon} 
        </Button>
        </FlexWrapper>
              {(this.state.showBody)? ticketBody : null} 
      </Card>
    )
  }

  private toggleShowBody = (event) => {
    event.preventDefault()
    const updatedState = !this.state.showBody
    this.setState({ showBody: updatedState })
  }

  private handleChange = ( event, origin) =>{
    event.preventDefault()
    this.setState( { [origin]:  event.target.value} )
  }
}

export default Ticket