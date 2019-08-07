import TicketHistoryPage from '../containers/ticket-history-page/index'
import React from 'react'
import {withRouter} from 'react-router';

const TicketHistoryPageRoute = (props) => <TicketHistoryPage ticketId={props.match.params.id} />

export default withRouter(TicketHistoryPageRoute);
 
