import React from 'react'
import styled from 'react-emotion'
import { Button, Input, Dropdown, TextArea} from 'semantic-ui-react'


const NewTicketBody = styled('div')`
	border: solid 1px gray;
  padding: 1em; 
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


class CreateNewTicket extends React.Component {

	state={ 
		inputAssignedTo: null, 
	}

	render() {
		return(
			<NewTicketBody>
			<h2>Create a new ticket</h2>
			<form>
			<label htmlFor={"inputDescription"}>Description:</label>
			<br/>
			<TextArea 
                  row={4} col={20} 
                  name="inputDescription"
                  placeholder={this.props.description}
                  value={this.state.inputDescription}
                  onChange={(e) => this.handleChange(e)}
                   />
            <br/>
			<label htmlFor={"assign"}>Assign to:</label>
			<Dropdown 
                   name="assign"
                   placeholder="Select team member"
                   search
                   selection
                   options={selectTeamOptions}
                   // value={this.state.inputAssignedTo}
                   onChange={(e, { value }) => {
                     this.setState({ inputAssignedTo: value }) }}
	           />
	         <p>Set reminder: [PLACEHOLDER]</p>
	         <Button>Create</Button>
	          </form>
			</NewTicketBody>
			)
	}

	handleChange = (e) => {
		e.preventDefault()
	}

}

export default CreateNewTicket 