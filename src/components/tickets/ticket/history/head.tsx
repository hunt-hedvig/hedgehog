import React from 'react'
import styled from 'react-emotion'

const Container = styled('div')`
  border: 1px black gray;
`

export const TicketHead = (props) => {
	return(
		<Container >
			<h2>Ticket history </h2>
			<p>id: {props.id} </p>
			<p>type: {props.type}</p>
			<p>created at: {props.createdAt} </p>
			<p>created by: {props.createdBy} </p>
		</Container>
	)
}