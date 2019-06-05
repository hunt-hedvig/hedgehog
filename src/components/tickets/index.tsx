import * as React from 'react'
import Ticket from './Ticket'

class Tickets extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Ticket />
        <Ticket />
        <Ticket />
        <Ticket />
        <Ticket />
      </React.Fragment>
    )
  }
}

export default Tickets
