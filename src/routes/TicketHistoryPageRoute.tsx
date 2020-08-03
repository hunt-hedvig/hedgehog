import React from 'react'
import { withRouter } from 'react-router'
import TicketHistoryPage from '../containers/ticket-history-page/index'

const TicketHistoryPageRoute = (props) => (
  <TicketHistoryPage ticketId={props.match.params.id} />
)

export default withRouter(TicketHistoryPageRoute)
