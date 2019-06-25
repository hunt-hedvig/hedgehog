import { colors } from '@hedviginsurance/brand'
import React from 'react'
import styled from 'react-emotion'
import  gql  from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Icon, Divider, Button, Segment, Form, Dropdown, TextArea} from 'semantic-ui-react'
import parse from 'date-fns/parse'

import { GET_TICKETS, CHANGE_DESCRIPTION, ASSIGN_TO, SET_REMINDER } from '../../features/taskmanager/queries'
import { IEX_TEAM_MEMBERS, createOptionsArray} from '../../features/taskmanager/types'


const teamOptions = createOptionsArray(IEX_TEAM_MEMBERS)


class EditTicket extends React.Component {

  public state={
    inputDescription: this.props.description,
    inputAssignedTo: this.props.assignedTo,
  }

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


render() {
  return (
    <Segment.Group>
        <Segment color="grey" compact ><em>Edit Ticket</em></Segment>
           <Mutation mutation={CHANGE_DESCRIPTION} >
          {
          ( changeTicketDescription, { data } ) => {
            return ( 
              
              <Form onSubmit ={(e) => {
                e.preventDefault()
                changeTicketDescription({ variables: { id: this.props.id, newDescription: this.state.inputDescription} })}
              }>
              <Form.Field>       
                <label htmlFor="description">Edit description: </label>
               <TextArea 
                  row={3} col={15} 
                  name="inputDescription"
                  placeholder={this.props.description}
                  value={this.state.inputDescription}
                  onChange={(e) => this.handleChange(e)}
                   />
                <Button compact basic type="submit">Change description</Button>
               </Form.Field >
       
              </Form>
            )
          } 
        }
        </Mutation>
        <Divider horizontal> </Divider>
          <Mutation mutation={ASSIGN_TO} key={this.props.id} >
          {
          ( assignTicketToTeamMember, { data } ) => {
            return ( 
              
              <Form onSubmit ={(e) => {
                e.preventDefault()
                assignTicketToTeamMember({ variables: { ticketId: this.props.id, teamMemberId: this.state.inputAssignedTo }})}
              }>
              <Form.Field inline>
                <label htmlFor="assign">Assign to Team Member: </label>
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
                <Button basic type="submit" compact>Assign</Button>
                   </Form.Field>
              </Form>
            )
          } 
        }
        </Mutation>
      </Segment.Group>
    )
  }



  private toggleEditTicket = (event) => {
    event.preventDefault()
    const updatedState = !this.state.showEditTicket
    this.setState({ showEditTicket: updatedState  })
  }


  private handleChange = ( event ) =>{
    event.preventDefault()
    // console.log(event.target.name)
    this.setState( { [event.target.name]:  event.target.value} )
  }



}



export default EditTicket
