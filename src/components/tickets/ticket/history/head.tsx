import React from 'react'
import { Segment } from 'semantic-ui-react'

interface ITicketHead {
  id: string
  type: string
  createdAt: string
  createdBy: string
}

export const TicketHead = (props: ITicketHead) => {
  return (
    <Segment>
      <h2>Ticket history </h2>
      <Segment.Group horizontal>
        <Segment>
          <strong>ID:</strong> {props.id}{' '}
        </Segment>
        <Segment>
          <strong>Ticket type:</strong> {props.type}
        </Segment>
      </Segment.Group>
      <Segment.Group horizontal>
        <Segment>
          <strong>Created at:</strong>{' '}
          {props.createdAt.slice(0, 19).replace('T', ' ')}{' '}
        </Segment>
        <Segment>
          <strong>Created by:</strong> {props.createdBy}{' '}
        </Segment>
      </Segment.Group>
    </Segment>
  )
}
