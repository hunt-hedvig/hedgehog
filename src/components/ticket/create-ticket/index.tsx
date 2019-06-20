import React from 'react'
import styled from 'react-emotion'
import { Button, Input, Dropdown, TextArea} from 'semantic-ui-react'
import { Mutation } from 'react-apollo'
import { CREATE_TICKET, GET_TICKETS } from '../../../features/taskmanager/queries'
import { IEX_TEAM_MEMBERS, 
  createOptionsArray, 
  TicketPriority, 
  TICKET_PRIORITY_HIGH,
  TICKET_PRIORITY_MEDIUM,
  TICKET_PRIORITY_LOW,
   } from '../../../features/taskmanager/types'


const NewTicketBody = styled('div')`
	border: solid 1px gray;
  padding: 1em; 
`

 //TODO: Fetch these or just match them to hardcoded values in Backoffice 
const teamOptions = createOptionsArray(IEX_TEAM_MEMBERS)

const priorityOptions = [ 
  {text: 'high', value: TICKET_PRIORITY_HIGH},
  {text: 'medium', value: TICKET_PRIORITY_MEDIUM},
  {text: 'low', value: TICKET_PRIORITY_LOW },   
  ] 

// const priorityOptions = [ 
//   {text: 'high', value: TicketPriority.HIGH},
//   {text: 'medium', value: TicketPriority.MEDIUM},
//   {text: 'low', value: TicketPriority.LOW },   
//   ] 

const updateCache = (cache, data, query) => {
  const newTicket = data.data[query]
  const updatedData  = {...cache.data.data}

  updatedData['Ticket:'+newTicket.id] = newTicket
    cache.writeQuery({
    query: GET_TICKETS,
    data:  updatedData,
  })
} 

class CreateNewTicket extends React.Component {
	state={ 
		assignedTo: null,
    createdBy: null, 
    priority: null,
    remindNotificationDate: "", 
    description: "",
	}
  //TODO::: GraphQl Mutation 

  componentDidMount() {
    let date = new Date().toISOString().substring(0,10);
    this.setState({remindNotificationDate: date })
  }

	render() {
		return(
			<NewTicketBody>
  			<h2>Create a new ticket</h2>
        <Mutation mutation={CREATE_TICKET} update={(cache, data)=> updateCache(cache, data, "createTicket" )}>
        {
          (createNewTicket, { data }) => {
            return (
        			<form onSubmit ={ e => { e.preventDefault() 
                createNewTicket({ variables: { 
                    assignedTo: this.state.assignedTo,
                    createdBy: this.state.createdBy,
                    priority: this.state.priority,
                    remindNotificationDate: this.state.remindNotificationDate,
                    description: this.state.description    
                  }})
                this.props.closeModal()
              }}>
        			<label htmlFor={"description"}>Description:</label>
        			<br/>
        			<TextArea 
                row={4} col={20} 
                name="description"
                placeholder="Type in a description"
                value={this.state.description}
                onChange={(e) => this.handleChange(e)}  
                 />
              <br/>
        			<label htmlFor={"createdby"}>Created by:</label>
        			<Dropdown 
                 name="createdby"
                 placeholder="Select team member"
                 search
                 selection
                 options={teamOptions}
                 // value={this.state.inputAssignedTo}
                 onChange={(e, { value }) => {
                     this.setState({ createdBy: value }) }}
  	           />
              <label htmlFor={"assign"}>Assign to:</label>
               <Dropdown 
                 name="assign"
                 placeholder="Select team member"
                 search
                 selection
                 options={teamOptions}
                 // value={this.state.inputAssignedTo}
                 onChange={(e, { value }) => {
                     this.setState({ assignedTo: value }) }}
               />
               <label htmlFor={"priority"}>Priority:</label>
               <Dropdown 
                 name="priority"
                 placeholder="Set priority"
                 selection
                 options={priorityOptions}
                 // value={this.state.inputAssignedTo}
                 onChange={(e, { value }) => {
                     this.setState({ priority: value }) }}
               />
    	         <p>Set reminder: [PLACEHOLDER]</p>
    	         <Button type="submit">Create</Button>
  	          </form>    
            )
          }
        }
        </Mutation>
			</NewTicketBody>
			)
	}

	private handleChange = (e) => {
		e.preventDefault()
    this.setState( { [event.target.name]:  event.target.value} )
	}

}

export default CreateNewTicket 