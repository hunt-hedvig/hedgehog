import React from 'react'
import { Query } from 'react-apollo'
import styled from 'react-emotion'
import { TICKET_HISTORY } from '../../../../features/taskmanager/queries'
import { TicketHead } from './head'
import { TicketRevision } from './revision'

const TicketContainer = styled('div')`
  border: 1px black gray;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
  margin: 10px auto;
  padding: 1em 1em;
  background: 'white';
  border-radius: 3px;
  max-width: 850px;
`

export class TicketHistory extends React.Component {
  public render() {
    return (
      <>
        <Query<any> query={TICKET_HISTORY} variables={{ id: this.props.id }}>
          {({ data, error, loading }) => {
            if (loading) {
              return <p>Loading</p>
            }
            if (error) {
              return (
                <p>
                  {' '}
                  Error! : {error.message} {error.networkError})
                </p>
              )
            }
            // We got the data:
            console.log(data)

            return (
              <TicketContainer>
                <TicketHead
                  id={data.ticketWithFullHistory.id}
                  type={data.ticketWithFullHistory.type}
                  createdAt={data.ticketWithFullHistory.createdAt}
                  createdBy={data.ticketWithFullHistory.createdBy}
                />
                {data.ticketWithFullHistory.revisions.map((revision) => (
                  <TicketRevision {...revision} />
                ))}
              </TicketContainer>
            )
          }}
        </Query>
      </>
    )
  }
}
