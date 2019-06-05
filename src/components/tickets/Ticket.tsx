import * as React from 'react'
import styled from 'react-emotion'

const Card = styled('div')({
  border: '1px solid gray',
  width: '400px',
  boxShadow: '1px 1px gray',
  margin: '10px auto',
  padding: '30px 30px',
  boxSizing: 'border-box',
  background: 'white',
  borderRadius: '10px',
})

class Ticket extends React.Component {
  public state = {
    ticketId: null,
    issuedBy: null,
    expanded: false,
  }

  public render() {
    const ticketBody = this.state.expanded ? (
      <body>
        <p>
          <strong>Type:</strong>Name
        </p>
        <p>
          <strong>Issued by:</strong>Name
        </p>
        <p>
          <strong>Priorty:</strong>Name
        </p>
        <p>
          Description: Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Hic, tempora cumque quaerat deleniti totam qui velit necessitatibus
          cupiditate?
        </p>
        <p>Assign ticket to: </p>
      </body>
    ) : null

    return (
      <Card>
        <p>
          <strong>Ticket:</strong>Name
        </p>
        {ticketBody}
        <button onClick={(event) => this.expandTicketHandler(event)}>
          EXPAND
        </button>
      </Card>
    )
  }

  private expandTicketHandler(event) {
    event.preventDefault()
    const changedState = !this.state.expanded
    this.setState({ expanded: changedState })
  }
}

export default Ticket
