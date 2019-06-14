import { colors } from '@hedviginsurance/brand'
import React from 'react'
import styled from 'react-emotion'
import  gql  from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { GET_TICKETS, CHANGE_DESCRIPTION, ASSIGN_TO, SET_REMINDER } from '../../features/taskmanager/queries'
import { Dropdown, TextArea} from 'semantic-ui-react'
import {format} from 'date-fns'

import { CLAIM, MESSAGE, REMIND, CALL_ME} from './icons'

const typeIcons = {
  CLAIM: CLAIM,
  MESSAGE: MESSAGE,
  REMIND: REMIND,
  CALL_ME: CALL_ME,
}

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
  border-radius: 12%;
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
     return 'seashell' 
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

// const setTime = () => new Date().toString()
// const setDate = () => new Date().toString()


const setTime = () => format( new Date(), "HH-mm").toString()
const setDate = () => format( new Date(), "MM-dd-yyyy").toString()
const createDateTime = (date, time) =>{
  return date.toString() + 'T' + time.toString() 
} 

class Ticket extends React.Component {
  public state = {
    showBody: false,
    inputDescription: this.props.description,
    inputAssignedTo: this.props.assignedTo,
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
                  row={3} col={15} 
                  name="inputDescription"
                  placeholder={this.props.description}
                  value={this.state.inputDescription}
                  onChange={(e) => this.handleChange(e)}
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


      </TicketBody>
    )
    const bookIcon = <i className={"fas fa-book-open"}></i>

    return (
      <Card>
        <FlexWrapper>
        <span>
          <strong>Type:</strong>
          <Blob color={this.props.type}>
            {this.getTypeIcon(this.props.type)}
          </Blob>
        </span>
        
        <span>
          <strong>Priority:</strong>
          <Blob color={this.props.priority}>
             {this.props.priority.toLowerCase()}
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

  private handleChange = ( event ) =>{
    event.preventDefault()
    // console.log(event.target.name)
    this.setState( { [event.target.name]:  event.target.value} )
  }

  private getTypeIcon = ( type ) => {
    const icon = typeIcons[type]
    return icon() 
  } 

}

export default Ticket