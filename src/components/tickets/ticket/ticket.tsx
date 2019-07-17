import { colors } from '@hedviginsurance/brand'
import React from 'react'
import styled from 'react-emotion'
import { Button, Popup, Grid  } from 'semantic-ui-react'
import { lookupTeamMemberName } from '../../../features/taskmanager/types'
import { ITicket } from '../types'
import { CALL_ME, CLAIM, MESSAGE, OTHER, REMIND } from './icons'
import TicketBody from './ticketBody'

const typeIcons = {
  CLAIM,
  MESSAGE,
  REMIND,
  CALL_ME,
  OTHER,
}

const Card = styled('div')({
  border: '1px black gray',
  boxShadow: '3px 3px 10px rgba(0,0,0,0.2)',
  margin: '10px auto',
  padding: '1em 1em',
  background: 'white',
  borderRadius: '3px',
  maxWidth: '800px',
   alignItems: 'baseline',
})

const red: IColor = {
  red: 236, 
  green: 54,
  blue: 54,
  alpha: 1.0,
}

const orange: IColor = {
  red: 233,
  green: 110,
  blue: 36,
  alpha: 1.0, 
}

const yellow: IColor = {
  red: 233,
  green: 200, 
  blue: 58, 
  alpha: 1.0, 
}

const green: IColor = {
  red: 110,
  green: 209, 
  blue: 80, 
  alpha: 1.0, 
}


const Blob = styled('span')`
  min-width: 10px,
  margin: 10px;
  padding: 1em 1em;
  background: white;
  border-radius: 12%;
  background-color: ${(props) => {

    if (props.color >= 0.66) {
      return interpolateBetweenColors ( orange, red, props.color )
    } else if (props.color > 0.33 && props.color < 0.66) {
      return interpolateBetweenColors ( yellow , orange, props.color )
    } else if (props.color < 0.33) {
      return interpolateBetweenColors ( green, yellow, props.color )
    } else {
      return 'seashell'
    }
  }};
`

interface IColor {
  red: number
  green: number
  blue: number
  alpha: number 
}

//t = [0 ... 1]
const interpolateBetweenColors = (colorA: IColor, colorB: IColor, t: number ): String  => {
   let red = Math.min(colorA.red * (1-t) + colorB.red * t, 255)  
   let green = Math.min(colorA.green * (1-t) + colorB.green * t, 255 )
   let blue = Math.min(colorA.blue * (1-t) + colorB.blue * t)
   let alpha = Math.min(colorA.alpha * (1-t) + colorB.alpha * t, 1)     
   let result =  "rgba(" + red.toFixed(0) + ","+ green.toFixed(0) + "," + blue.toFixed(0) + "," + alpha + ")"
   return result 
}

const FlexWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignContent: 'space-between',
  alignItems: 'baseline',
})


class Ticket extends React.Component<ITicket, {}> {
  public state = {
    showBody: false,
  }

  public render() {
    return (
      <Card >
        <Grid container divided stackable columns="equal" verticalAlign="middle"  >
          <Grid.Row >
       {/*  <FlexWrapper> */}
         <Grid.Column floated="left" > 
          <span>
            {/* <strong>Type:</strong> */}
            <Popup
              content={'ticket type: ' + this.props.type.toLowerCase()}
              trigger={
                <Blob color={this.props.type}>
                  {this.getTypeIcon(this.props.type)}
                </Blob>
              }
            />
          </span>
          </Grid.Column>
          
          <Grid.Column width={3}>
          <span>
             <strong>Priority: </strong>
            <Blob color={this.props.priority} />
          </span>
          </Grid.Column>

          <Grid.Column width={5}>
            <strong>Assigned to:</strong>
            <Blob color={'seashell'}>
              {lookupTeamMemberName(this.props.assignedTo)}
            </Blob>
          </Grid.Column>

          <Grid.Column width={4}>
          {this.props.reminder && this.props.reminder.date ? (
            <span>
              <strong>Remind:</strong>
              <Blob color={this.props.assignedTo}>
                {getNotificationTimeInWords(this.props.reminder.date)}
              </Blob>
            </span>
          ) : null}
          </Grid.Column>

          <Grid.Column floated="right">
          <Button
            onClick={(event) => this.toggleShowBody(event)}
            compact
          >
            Show details
          </Button>
          </Grid.Column>
          </Grid.Row>
        </Grid>


      {/*    </FlexWrapper> */ }
        {this.state.showBody ? (
          <TicketBody
            description={this.props.description}
            assignedTo={this.props.assignedTo}
            status={this.props.status}
            id={this.props.id}
            reminder={this.props.reminder}
          />
        ) : null}
      </Card>
    )
  }

  private toggleShowBody = (event) => {
    event.preventDefault()
    const updatedState = !this.state.showBody
    this.setState({ showBody: updatedState })
  }

  private getTypeIcon = (type) => {
    const icon = typeIcons[type]
    return icon
  }
}

// TODO: Fix this
const getNotificationTimeInWords = (dateTime) => {
  return dateTime
}

export default Ticket
