import React from 'react'
import styled from 'react-emotion'

import { Segment  } from 'semantic-ui-react'


const Container = styled('div')`
  border: 1px black gray;
  backgroud: 'salmon';
`

export const TicketHead = (props) => {
	return(
		<Segment>
			<h2>Ticket history </h2>
            <Segment.Group horizontal>
			    <Segment><strong>ID:</strong> {props.id} </Segment>
			    <Segment><strong>Ticket type:</strong> {props.type}</Segment>
            </Segment.Group>
            <Segment.Group horizontal>
    			<Segment><strong>Created at:</strong> {props.createdAt.slice(0,19).replace("T", " ")} </Segment>
	    		<Segment><strong>Created by:</strong> {props.createdBy} </Segment>
            </Segment.Group>

		</Segment>
	)
}