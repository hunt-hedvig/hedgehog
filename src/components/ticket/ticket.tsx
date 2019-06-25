import { colors } from '@hedviginsurance/brand'
import React from 'react'
import styled from 'react-emotion'
import { Icon, Button, Popup } from 'semantic-ui-react'
import parse from 'date-fns/parse'
import { CLAIM, MESSAGE, REMIND, CALL_ME, OTHER} from './icons'
import TicketBody from './ticketBody'


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



// const createDateTime = (date, time) =>{
//   return date.toString() + 'T' + time.toString() 
// } 

class Ticket extends React.Component {
  public state = {
    showBody: false,
  }

  public render() {
     return (
      <Card>
        <FlexWrapper>
        <span>
          {/* <strong>Type:</strong> */}
          <Popup 
            content={"ticket type: " + this.props.type.toLowerCase()}
            trigger={
              <Blob color={this.props.type}>
                {this.getTypeIcon(this.props.type)}
              </Blob>
            }
          />
        </span>
        
        <span>
          {/* <strong>Priority:</strong> */}
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
          {
            (this.state.showBody) ? 
              <TicketBody 
                description={this.props.description}
                assignedTo={this.props.assignedTo}
                id={this.props.id}
              />
             : null
           } 
      </Card>
    )
  }

  private toggleShowBody = (event) => {
    event.preventDefault()
    const updatedState = !this.state.showBody
    this.setState({ showBody: updatedState })
  }

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