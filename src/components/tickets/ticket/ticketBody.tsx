// @ts-nocheck
import { gql } from 'apollo-boost'
import { addDays, isFriday, set } from 'date-fns'
import format from 'date-fns/format'
import { CHANGE_STATUS, GET_TICKETS } from 'features/taskmanager/queries'
import {
  createOptionsArray,
  IEX_TEAM_MEMBERS_OPTIONS,
  lookupStatus,
  TICKET_STATUS,
  TicketStatus,
  TicketType,
} from 'features/taskmanager/types'
import React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'
import { Button, Divider, Grid, Icon, Segment } from 'semantic-ui-react'
import { history } from 'store'
import { IRemindNotification } from '../types'
import AssignTicketToMutation from './edit-ticket-mut/assignTo'
import ChangeDescriptionMutation from './edit-ticket-mut/description'
import ChangeReminderMutation from './edit-ticket-mut/reminder'
import ChangeStatusMutation from './edit-ticket-mut/status'
import { Redirector } from './util/redirect'

const teamOptions = createOptionsArray(IEX_TEAM_MEMBERS_OPTIONS)
const statusOptions = createOptionsArray(TICKET_STATUS)

const TicketBodyCss = styled('div')`
  padding: 1em;
  margin: 1em;
  border: 1px lightgray solid;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(227, 231, 235, 0.33) 100%
  );
`

const StyledPre = styled('pre')`
  font-family: inherit;
  margin: 0;
  white-space: pre-line;
`

interface ITicketBody {
  id: string
  assignedTo: string
  status: TicketStatus
  description: string
  reminder: IRemindNotification
  type: TicketType
  memberId: string
  referenceId: string
}

interface ITicketBodyState {
  inputs: {
    description: string
    assignedTo: string
    remindDate: any
    remindTime: any
    remindMessage: string
    status: TicketStatus
    touched: {
      description: boolean
      remindDate: boolean
      remindTime: boolean
      remindMessage: boolean
    }
  }
  showEditTicket: boolean
  redirect: boolean
}

export const IM_ON_IT_MUTATION = gql`
  mutation ImOnIt(
    $ticketId: ID!
    $teamMemberId: ID!
    $newStatus: TicketStatus
  ) {
    assignTicketToTeamMember(ticketId: $ticketId, teamMemberId: $teamMemberId)
    changeTicketStatus(ticketId: $ticketId, newStatus: $newStatus)
  }
`

export class TicketBody extends React.Component<
  ITicketBody,
  ITicketBodyState,
  {}
> {
  public state = {
    inputs: {
      description: this.props.description,
      assignedTo: this.props.assignedTo,
      status: this.props.status,
      remindDate: format(
        addDays(new Date(), isFriday(new Date()) ? 3 : 1),
        'yyyy-MM-dd',
      ),
      remindTime: format(
        set(new Date(), { hours: 9, minutes: 0, seconds: 0 }),
        'HH:mm:ss',
      ),
      remindMessage: '',
      touched: {
        description: false,
        assignedTo: false,
        status: false,
        remindDate: false,
        remindTime: false,
        remindMessage: false,
      },
    },
    showEditTicket: false,
    redirect: false,
  }

  public render() {
    const editTicket = (
      <Grid celled>
        <Button
          labelPosition="left"
          icon
          onClick={(event) => this.toggleEditTicket(event)}
          basic
          toggle
        >
          {this.state.showEditTicket ? (
            <Icon name="close" />
          ) : (
            <Icon name="pencil alternate" />
          )}
          {this.state.showEditTicket ? 'Close Edit' : 'Open Edit'}
        </Button>
        <Grid.Row>
          <Grid.Column>
            <ChangeDescriptionMutation
              id={this.props.id}
              description={this.state.inputs.description}
              touched={this.state.inputs.touched.description}
              handleChange={this.handleChange}
              oldDescription={this.props.description}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid columns={2} stackable>
            <Grid.Row verticalAlign="middle">
              <Grid.Column>
                <AssignTicketToMutation
                  id={this.props.id}
                  handleChange={this.handleOptionChange}
                  options={teamOptions}
                  assignedTo={this.state.inputs.assignedTo}
                  currentlyAssignedTo={this.props.assignedTo}
                />
              </Grid.Column>
              <Grid.Column>
                <ChangeStatusMutation
                  id={this.props.id}
                  status={this.state.inputs.status}
                  handleChange={this.handleOptionChange}
                  options={statusOptions}
                  currentStatus={this.props.status}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <strong>Set reminder</strong>

            <ChangeReminderMutation
              id={this.props.id}
              remindDate={this.state.inputs.remindDate}
              remindTime={this.state.inputs.remindTime}
              remindMessage={this.state.inputs.remindMessage}
              handleChange={this.handleChange}
              currentReminder={this.props.reminder}
              touchedDate={this.state.inputs.touched.remindDate}
              touchedTime={this.state.inputs.touched.remindTime}
              touchedMessage={this.state.inputs.touched.remindMessage}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )

    const ticketInfo = (
      <>
        <Segment.Group>
          <Segment color="grey" compact>
            <strong>Description</strong>
          </Segment>
          <Segment compact textAlign="left">
            <StyledPre>{this.props.description}</StyledPre>
          </Segment>
        </Segment.Group>

        <Segment.Group horizontal>
          <Segment compact>
            <strong>Status:</strong> {lookupStatus(this.props.status)}{' '}
          </Segment>
          {this.fillInMemberId(this.props.memberId)}
        </Segment.Group>
      </>
    )

    return (
      <TicketBodyCss>
        {this.state.showEditTicket ? editTicket : ticketInfo}

        {this.getResolveOption()}
        {this.props.referenceId
          ? this.createReferenceRoute(
              this.props.referenceId,
              this.props.memberId,
              this.props.type,
            )
          : null}

        <Button
          labelPosition="left"
          icon
          onClick={(event) => this.toggleEditTicket(event)}
          basic
          toggle
          floated="right"
        >
          {this.state.showEditTicket ? (
            <Icon name="close" />
          ) : (
            <Icon name="pencil alternate" />
          )}
          {this.state.showEditTicket ? 'Close Edit' : 'Open Edit'}
        </Button>

        <Button
          floated="right"
          onClick={() =>
            history.push('/ticket_history/' + this.props.id.toString())
          }
        >
          View history
        </Button>
      </TicketBodyCss>
    )
  }

  private toggleEditTicket = (event) => {
    event.preventDefault()
    const updatedState = !this.state.showEditTicket
    this.setState({ showEditTicket: updatedState })
  }

  private handleOptionChange = (id: string, value: string): void => {
    const inputs = { ...this.state.inputs }
    inputs[id] = value
    this.setState({ inputs })
  }

  private handleChange = (event) => {
    const inputs = { ...this.state.inputs }
    inputs[event.target.name] = event.target.value
    inputs.touched[event.target.name] = true
    this.setState({ inputs })
  }

  private fillInMemberId = (memberId: string) => {
    if (memberId === null) {
      return null
    }
    return (
      <Segment compact>
        <strong>MemberId: </strong>
        <a
          href="#"
          onClick={() =>
            history.push(`/members/${memberId}`, { to: 'details' })
          }
        >
          {memberId}
        </a>
      </Segment>
    )
  }

  private createReferenceRoute = (
    referenceId: string,
    memberId: string,
    type: TicketType,
  ) => {
    switch (type) {
      case TicketType.CLAIM: {
        if (!memberId) {
          return null
        }
        const route = '/claims/' + referenceId + '/members/' + memberId
        return <Redirector route={route} redirectText="Go to claim" />
      }
      default:
        return null
    }
  }

  private getResolveOption = () => {
    if (
      this.props.assignedTo === this.props.me &&
      this.props.status === TicketStatus.WORKING_ON
    ) {
      return (
        <>
          <Mutation mutation={CHANGE_STATUS}>
            {(resolveTicket) => (
              <Button
                primary={true}
                onClick={() => this.resolveTicketClick(resolveTicket)}
              >
                Resolve ticket
              </Button>
            )}
          </Mutation>
          <Mutation mutation={IM_ON_IT_MUTATION}>
            {(resolveTicket) => (
              <Button
                secondary={true}
                onClick={() => this.imBlockedClick(resolveTicket)}
              >
                I'm blocked
              </Button>
            )}
          </Mutation>
        </>
      )
    }
    if (
      this.props.status === TicketStatus.WAITING ||
      this.props.status === TicketStatus.ON_HOLD
    ) {
      return (
        <Mutation mutation={IM_ON_IT_MUTATION}>
          {(imOnIt) => (
            <Button secondary={true} onClick={() => this.imOnItClick(imOnIt)}>
              {this.props.status === TicketStatus.WAITING
                ? "I'm on it"
                : 'Revive ticket'}
            </Button>
          )}
        </Mutation>
      )
    }
    return (
      <Button
        labelPosition="left"
        icon
        onClick={(event) => this.toggleEditTicket(event)}
        basic
        toggle
      >
        {this.state.showEditTicket ? (
          <Icon name="close" />
        ) : (
          <Icon name="pencil alternate" />
        )}
        {this.state.showEditTicket ? 'Close Edit' : 'Open Edit'}
      </Button>
    )
  }

  private resolveTicketClick = (mutation) => {
    mutation({
      variables: {
        ticketId: this.props.id,
        newStatus: TicketStatus.RESOLVED,
      },
      refetchQueries: [{ query: GET_TICKETS }],
    })
  }

  private imOnItClick = (mutation) => {
    mutation({
      variables: {
        ticketId: this.props.id,
        teamMemberId: this.props.me,
        newStatus: TicketStatus.WORKING_ON,
      },
      refetchQueries: [{ query: GET_TICKETS }],
    })
  }

  private imBlockedClick = (mutation) => {
    mutation({
      variables: {
        ticketId: this.props.id,
        teamMemberId: this.props.me,
        newStatus: TicketStatus.ON_HOLD,
      },
      refetchQueries: [{ query: GET_TICKETS }],
    })
  }
}
