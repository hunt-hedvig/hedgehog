import * as React from 'react'
import styled from 'react-emotion'

const Card = styled('div')({
  border: '1px solid gray',
  width: '400px',
  boxShadow: '1px 1px gray',
  margin: 'auto',
  padding: '30px 30px',
  boxSizing: 'border-box',
  background: 'white',
  borderRadius: '10px',
})

// public interface ITicket {
//     id: string,
//     issuedBy: string,
//     dateIssued: string,
//     lastChanged: string,
//     status: string,
//     resolved: string,
//     content: string,
// }

class Ticket extends React.Component {
  public state = {
    ticketId: null,
    issuedBy: null,
  }

  public render() {
    return (
      <Card>
        <p>
          <strong>Ticket:</strong>Name
        </p>
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
      </Card>
    )
  }
}

export default Ticket
