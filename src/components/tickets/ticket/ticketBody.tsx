import { gql } from 'apollo-boost'
import format from 'date-fns/format'
import { CHANGE_STATUS, QUESTION_IS_DONE } from 'features/taskmanager/queries'
import React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'
import { Button, Divider, Grid, Icon, Segment } from 'semantic-ui-react'
import { history } from 'store'
import {
  createOptionsArray,
  IEX_TEAM_MEMBERS_OPTIONS,
  lookupStatus,
  TICKET_STATUS,
  TicketStatus,
  TicketType,
} from '../../../features/taskmanager/types'
import { IRemindNotification } from '../types'
import MessageResponseForm from './body/message-response'
import AssignTicketToMutation from './edit-ticket-mut/assignTo'
import ChangeDescriptionMutation from './edit-ticket-mut/description'
import ChangePriorityMutation from './edit-ticket-mut/priority'
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
  priority: number
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
    priority: number
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
      remindDate: format(new Date(), 'yyyy-MM-dd'),
      remindTime: format(new Date(), 'HH:mm:ss'),
      remindMessage: '',
      priority: this.props.priority,
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
        <Divider horizontal> </Divider>

        <Grid.Row>
          <Grid.Column>
            <ChangePriorityMutation
              id={this.props.id}
              priority={this.state.inputs.priority}
              oldPriority={this.props.priority}
              handleChange={this.handleChange}
            />
          </Grid.Column>
        </Grid.Row>
        <Divider horizontal> </Divider>

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

          {this.props.referenceId && this.props.referenceId.length > 0
            ? this.createReferenceRoute(
                this.props.referenceId,
                this.props.memberId,
                this.props.type,
              )
            : null}
        </Segment.Group>

        <Segment.Group horizontal>
          <Segment compact>
            <strong>Status:</strong> {lookupStatus(this.props.status)}{' '}
          </Segment>
          {this.fillInMemberId(this.props.memberId)}
          {this.fillInReferenceId(this.props.type, this.props.referenceId)}
        </Segment.Group>
      </>
    )

    return (
      <TicketBodyCss>
        {this.state.showEditTicket ? editTicket : ticketInfo}

        {this.getResolveOption()}

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

  private fillInReferenceId = (type: TicketType, referenceId: string) => {
    let label: string
    switch (type) {
      case TicketType.CLAIM:
        label = 'ClaimId: '
        break

      case TicketType.MESSAGE:
        label = 'MessageId: '

        break
      default:
        return null
    }
    return (
      <Segment compact>
        <strong>{label}</strong>
        {referenceId}{' '}
      </Segment>
    )
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
        const route = 'claims/' + referenceId + '/members/' + memberId
        return <Redirector route={route} redirectText="Go to claim" />
      }
      case TicketType.MESSAGE: {
        const route = 'members/' + memberId
        return <Redirector route={route} redirectText="Go to chat" />
      }
      default:
        return null
    }
  }

  private getResolveOption = () => {
    if (
      this.props.type === TicketType.MESSAGE &&
      this.props.assignedTo === this.props.me
    ) {
      return <MessageResponseForm memberId={this.props.memberId} />
    }
    if (this.props.assignedTo === this.props.me) {
      return (
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
      )
    }
    if (
      this.props.status === TicketStatus.WAITING &&
      this.props.assignedTo == null
    ) {
      return (
        <Mutation mutation={IM_ON_IT_MUTATION}>
          {(imOnIt) => (
            <Button secondary={true} onClick={() => this.imOnItClick(imOnIt)}>
              I'm on it
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
    })
  }

  private imOnItClick = (mutation) => {
    mutation({
      variables: {
        ticketId: this.props.id,
        teamMemberId: this.props.me,
        newStatus: TicketStatus.WORKING_ON,
      },
    })
  }
}
