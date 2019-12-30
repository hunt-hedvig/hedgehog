import { gql } from 'apollo-boost'
import formatDistance from 'date-fns/formatDistance'
import isAfter from 'date-fns/isAfter'
import isSameDay from 'date-fns/isSameDay'
import parse from 'date-fns/parse'
import React from 'react'
import { Query } from 'react-apollo'
import styled from 'react-emotion'
import { Button, Grid, Popup } from 'semantic-ui-react'
import {
  lookupTeamMemberName,
  TicketStatus,
} from '../../../features/taskmanager/types'
import { ITicket } from '../types'
import { ColorIndicator } from './color-indicator/colorIndicator'
import { CALL_ME, CLAIM, COMPLETED, MESSAGE, OTHER, REMIND } from './icons'
import { OverdueNotifier } from './overdue-notifier/overdueNotifier'
import { TicketBody } from './ticketBody'

const typeIcons = {
  CLAIM,
  MESSAGE,
  REMIND,
  CALL_ME,
  OTHER,
  COMPLETED,
}

const Card = styled('div')`
  border: 1px black gray;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
  margin: 10px auto;
  padding: 1em 1em;
  background: ${(props) =>
    props.status === TicketStatus.RESOLVED ? 'rgba(40,100,40,0.01)' : 'white'};
  border-radius: 3px;
  align-items: baseline;
  max-width: 850px;
`
const SmallText = styled('div')`
  font-size: 0.8em;
`

const GET_MEMBER_NAME_QUERY = gql`
  query GetMember($memberId: ID!) {
    member(id: $memberId) {
      firstName
      lastName
    }
  }
`

export class Ticket extends React.Component<ITicket, {}> {
  public state = {
    showBody: true,
  }

  public render() {
    return (
      <Card status={this.props.status}>
        <Grid
          container
          divided
          stackable
          columns="equal"
          verticalAlign="middle"
        >
          <Grid.Row>
            <Grid.Column floated="left">
              <Popup
                content={'Ticket type: ' + this.props.type.toLowerCase()}
                trigger={<span>{this.getTypeIcon(this.props.type)}</span>}
              />
              {this.props.status === TicketStatus.RESOLVED && (
                <Popup
                  content={'Ticket has been completed'}
                  trigger={this.getTypeIcon('COMPLETED')}
                />
              )}
              {this.props.overdue ? (
                <OverdueNotifier reminder={this.props.reminder!!} />
              ) : null}
            </Grid.Column>

            <Grid.Column width={3}>
              <strong>Priority:</strong>
              <ColorIndicator percentage={this.props.priority} />
            </Grid.Column>

            <Grid.Column width={4}>
              <Grid.Row>
                <strong>Assigned to: </strong>
                {lookupTeamMemberName(this.props.assignedTo)}
              </Grid.Row>
              {this.props.memberId ? (
                <Grid.Row>
                  <SmallText>
                    <strong>Member: </strong>
                    <Query
                      query={GET_MEMBER_NAME_QUERY}
                      variables={{ memberId: this.props.memberId }}
                    >
                      {({ loading, error, data }) => {
                        if (loading) {
                          return <>Loading...</>
                        }
                        if (error) {
                          return <>Error</>
                        }
                        return (
                          <>
                            {data.member.firstName} {data.member.lastName}
                          </>
                        )
                      }}
                    </Query>
                  </SmallText>
                </Grid.Row>
              ) : null}
            </Grid.Column>

            <Grid.Column width={5}>
              <Grid.Row>
                <SmallText>
                  <strong>Created at: </strong>{' '}
                  {this.props.createdAt.slice(0, 19).replace('T', ' ')}
                </SmallText>
              </Grid.Row>
              <Grid.Row>
                {this.props.reminder && this.props.reminder.date ? (
                  <SmallText>
                    <strong>Remind: </strong>
                    {getReminderTimeInWords(
                      this.props.reminder.date,
                      this.props.reminder.time,
                    )}
                  </SmallText>
                ) : null}
              </Grid.Row>
            </Grid.Column>

            <Grid.Column floated="right">
              <Button onClick={(event) => this.toggleShowBody(event)} compact>
                {this.state.showBody ? '' + 'Hide details' : 'Show details'}
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {this.state.showBody ? <TicketBody {...this.props} /> : null}
      </Card>
    )
  }

  private toggleShowBody = (event) => {
    event.preventDefault()
    const updatedState = !this.state.showBody
    this.setState({ showBody: updatedState })
  }

  private getTypeIcon = (type) => {
    const icon = typeIcons[type]
    return icon
  }
}

const getReminderTimeInWords = (date, time) => {
  const now = new Date()
  const parsedDate = parse(date, 'yyyy-MM-dd', now)
  const parsedTime = parse(time, 'HH:mm:ss', now)
  if (isSameDay(parsedDate, now) && isAfter(parsedTime, now)) {
    return formatDistance(now, parsedTime)
  } else if (isAfter(parsedDate, now)) {
    return date + ', ' + time
  } else {
    return 'has passed: ' + date
  }
}
