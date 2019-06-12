import { colors } from '@hedviginsurance/brand'
import React from 'react'
import styled from 'react-emotion'

const Card = styled('div')({
  border: '1px black gray',
  boxShadow: '3px 3px 10px gray',
  margin: '10px auto',
  padding: '1em 1em',
  background: 'white',
  borderRadius: '3px',
  maxWidth: '800px',
})

// const Blob = styled('span')({
//   margin: '10px',
//   padding: '1em 1em',
//   background: 'white',
//   borderRadius: '3px',
//   backgroundColor: colors.LIGHT_GRAY,
// })

const Blob = styled('span')`
  margin: 10px;
  padding: 1em 1em;
  background: white;
  border-radius: 3px;
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
  }  };
`


const Button = styled('button')({
  background: colors.GREEN,
  border: 'none',
  cursor: 'pointer',
  padding: '1em 1em',
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

class Ticket extends React.Component {
  public state = {
    showBody: false,
  }

  public render() {
    const ticketBody = (
      <React.Fragment>
        <p>Description: {this.props.description}</p>
        <p>Status: {this.props.status}</p>
      </React.Fragment>
    )

    return (
      <Card>
        <FlexWrapper>
        <Blob color={this.props.type}>
          <strong>Type:</strong> {this.props.type}
        </Blob>
        <Blob color={this.props.priority}>
          <strong>Priority:</strong> {this.props.priority}
        </Blob>
        <Blob color={this.props.assignedTo}>
          <strong>Assigned to:</strong> {this.props.assignedTo}
        </Blob>
        <Button onClick={(event) => this.toggleShowBody(event)}>
          Show details
        </Button>
        </FlexWrapper>
        {this.state.showBody ? ticketBody : null}
      </Card>
    )
  }

  private toggleShowBody = (event) => {
    event.preventDefault()
    const updatedState = !this.state.showBody
    this.setState({ showBody: updatedState })
  }
}

export default Ticket
