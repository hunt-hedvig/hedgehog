import React from 'react'
import { Label, Segment  } from 'semantic-ui-react'
import { TicketChangeType } from   '../../../../features/taskmanager/types'


export const TicketRevision = (props) => {
	
    let ticketDetails 

    switch (props.changeType) {
       case TicketChangeType.TICKET_CREATED:
            ticketDetails = (<Segment>Ticket created details </Segment>)
       break;
        
       case TicketChangeType.CHANGED_REMINDER: 
            ticketDetails = (<Segment>Change reminder details </Segment>)

       break;

       case TicketChangeType.CHANGED_ASSIGNED_TO:
            ticketDetails = (<Segment>Changed assigned to  details </Segment>)


       case  TicketChangeType.CHANGED_DESCRIPTION:
            ticketDetails = (<Segment>Description changed details </Segment>)
        break
      
       case TicketChangeType.CHANGED_STATUS: 
            ticketDetails = (<Segment>Change status  details </Segment>)
       break
      
       case TicketChangeType.CHANGED_PRIORITY: 
            ticketDetails = (<Segment>Change priority details </Segment>)
       break

       default:
            ticketDetails = (<Segment>Something went wrong... details </Segment>)
        break;
    }

    return (
		<Segment raised vertical>
			<Label ribbon>Revision</Label>
			<Segment.Group horizontal>
				<Segment><strong>A revision of type:</strong> {props.changeType} </Segment>
				<Segment><strong>Changed by:</strong> {props.changedBy} </Segment>
				<Segment><strong>Changed at:</strong> {props.changedAt}</Segment>
			</Segment.Group >
	        <Segment.Group>
                {ticketDetails}
            </Segment.Group>
    	</Segment>
        ) 
}

