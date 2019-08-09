import React from 'react'
import { Query } from 'react-apollo'
import styled from 'react-emotion'
import { TICKET_HISTORY } from '../../../../features/taskmanager/queries'
import { TicketHead } from './head'
import { TicketRevision } from './revision'
import { Divider, Segment  } from 'semantic-ui-react'


const TicketContainer = styled('div')`
  border: 1px black gray;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
  margin: 10px auto;
  padding: 1em 1em;
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
              return <p>Loading ticket history...</p>
            }
            if (error) {
              return (
                <p>
                  {' '}
                  Error! : {error.message} {error.networkError})
                </p>
              )
            }
            return (
              <TicketContainer>
              <Segment>
                <TicketHead
                  id={data.ticketWithFullHistory.id}
                  type={data.ticketWithFullHistory.type}
                  createdAt={data.ticketWithFullHistory.createdAt}
                  createdBy={data.ticketWithFullHistory.createdBy}
                />
                {data.ticketWithFullHistory.revisions.map((revision) => (
                  <>
                      <Divider horizontal key={revision.createdAt}/>
                      <TicketRevision  key={revision.createdAt} {...revision} />
                  </>
                ))}
                </Segment>
              </TicketContainer>
            )
          }}
        </Query>
      </>
    )
  }
}
