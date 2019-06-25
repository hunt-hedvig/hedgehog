import { colors } from '@hedviginsurance/brand'
import React from 'react'
import styled from 'react-emotion'
import  gql  from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Icon, Divider, Button, Segment, Form, Dropdown, TextArea} from 'semantic-ui-react'
import parse from 'date-fns/parse'

import { GET_TICKETS, CHANGE_DESCRIPTION, ASSIGN_TO, SET_REMINDER } from '../../features/taskmanager/queries'
import { IEX_TEAM_MEMBERS, createOptionsArray} from '../../features/taskmanager/types'
import { CLAIM, MESSAGE, REMIND, CALL_ME, OTHER} from './icons'

import EditTicket from './editTicket'


const typeIcons = {
  CLAIM: CLAIM,
  MESSAGE: MESSAGE,
  REMIND: REMIND,
  CALL_ME: CALL_ME,
  OTHER: OTHER, 
}

const Card = styled('div')({
  border: '1px black gray',
  boxShadow: '3px 3px 10px rgba(0,0,0,0.2)',
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

const FlexWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-evenly',
  alignContent: 'space-between',
  alignItems: 'baseline',

})

const teamOptions = createOptionsArray(IEX_TEAM_MEMBERS)


const createDateTime = (date, time) =>{
  return date.toString() + 'T' + time.toString() 
} 

class Ticket extends React.Component {
  public state = {
    showBody: false,
    showEditTicket: false, 
    // inputDescription: this.props.description,
    // inputAssignedTo: this.props.assignedTo,
  }

  public render() {


    const ticketInfo = (
       <Segment.Group>
        <Segment color="grey" compact><strong>Description</strong></Segment>
        <Segment compact textAlign="left">{this.props.description}</Segment>
        <Segment compact>Status: {this.props.status} </Segment>
      </Segment.Group> 
    )

    const ticketBody = (
      <TicketBody>

       { 
         this.state.showEditTicket ?   
         <EditTicket 
          description={this.props.description}
          assignedTo={this.props.assignedTo}
          id={this.props.id}
          /> 
          : ticketInfo 
       }

      <Button 
        labelPosition="left" 
        icon 
        onClick={(event) => this.toggleEditTicket(event)}
        basic
        toggle
        active={this.state.showEditTicket}
        > 
          <Icon name="pencil alternate"/>
          Edit 
      </Button>
      </TicketBody>
    )


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
              {getNotificationTimeInWords(this.props.remindNotificationDate)}
            </Blob>
          </span>
          : null 
         }

        <Button 
          onClick={(event) => this.toggleShowBody(event)}
          size="medium"  
          compact
        >
          Show details  
        </Button>
        </FlexWrapper>
              {(this.state.showBody)? ticketBody : null} 
      </Card>
    )
  }

  private toggleEditTicket = (event) => {
    event.preventDefault()
    const updatedState = !this.state.showEditTicket
    this.setState({ showEditTicket: updatedState  })
  }

  private toggleShowBody = (event) => {
    event.preventDefault()
    const updatedState = !this.state.showBody
    this.setState({ showBody: updatedState })
  }

  // private handleChange = ( event ) =>{
  //   event.preventDefault()
  //   // console.log(event.target.name)
  //   this.setState( { [event.target.name]:  event.target.value} )
  // }

  private getTypeIcon = ( type ) => {
    const icon = typeIcons[type]
    return icon 
  } 

}

const getNotificationTimeInWords = (dateTime) => {
  return dateTime
    // var [date, time ] = dateTime.split('T')
    // console.log(date)
    // console.log(time)
    // console.log(dateTime)

    // var parsedD = parse(date, 'yyyy-MM-dd', Date())
    // console.log(parsedD)

    // var parsedT = parse('10:03:22', 'HH:mm:ss', Date())
    // console.log(parsedT)

}


export default Ticket