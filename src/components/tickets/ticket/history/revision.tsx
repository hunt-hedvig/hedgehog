import React from 'react'

export const TicketRevision = (props) => {
	return (
		<div>
			<h3>New revision</h3>
			<p>A revision of type: {props.changeType}</p>
			<p>Changed by: {props.changedBy}</p>
			<p>Changed at: {props.changedAt}</p>
			<p> more to come... </p>
		</div>
		) 
}