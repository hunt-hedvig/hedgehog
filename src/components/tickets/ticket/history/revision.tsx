import React from 'react'
import { Button, Grid, Label, Segment, StickyProps } from 'semantic-ui-react'
import {
  lookupStatus,
  TicketChangeType,
  TicketStatus,
} from '../../../../features/taskmanager/types'

interface ITicketRevision {
  changeType: TicketChangeType
  changedBy: string
  changedAt: string
  description?: string
  assignedTo?: string
  status?: TicketStatus
  manualPriority?: number
  remindDate?: string
  remindTime?: string
  remindMessage?: string
}

export class TicketRevision extends React.Component<ITicketRevision, {}> {
  public state = {
    showDetails: false,
  }

  public render() {
    return (
      <Segment.Group raised vertical>
        <Label ribbon color="blue">
          Revision
        </Label>
        <Button
          compact
          size="tiny"
          color="vk"
          onClick={this.toggleShowDetails}
          floated="right"
        >
          {this.state.showDetails ? 'Hide details' : 'Show details'}
        </Button>
        <Segment.Group horizontal>
          <Segment>
            <Label attached="top">A revision of type:</Label>{' '}
            <p>{this.props.changeType}</p>{' '}
          </Segment>
          <Segment>
            <Label attached="top">Changed by:</Label>{' '}
            <p>{this.props.changedBy}</p>{' '}
          </Segment>
          <Segment>
            <Label attached="top">Changed at:</Label>{' '}
            <p>{this.props.changedAt.slice(0, 19).replace('T', ' ')}</p>
          </Segment>
        </Segment.Group>
        <Segment>
          {this.state.showDetails
            ? this.renderTicketDetails(this.props.changeType)
            : null}
        </Segment>
      </Segment.Group>
    )
  }

  private toggleShowDetails = (event) => {
    event.preventDefault()
    const newState = !this.state.showDetails
    this.setState({ showDetails: newState })
  }

  private renderTicketDetails = (changeType) => {
    switch (changeType) {
      case TicketChangeType.TICKET_CREATED:
        return (
          <Grid columns={2} celled>
            <Grid.Row>
              <Grid.Column>Original ticket</Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4}>
                <em>Description</em>
              </Grid.Column>
              <Grid.Column>{this.props.description}</Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4}>
                <em>Assigned to:</em>
              </Grid.Column>
              <Grid.Column>{this.props.assignedTo}</Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4}>
                <em>Manual priority:</em>
              </Grid.Column>
              <Grid.Column>{this.props.manualPriority}</Grid.Column>
            </Grid.Row>
          </Grid>
        )

      case TicketChangeType.CHANGED_REMINDER:
        return (
          <Grid columns={2} celled>
            <Grid.Row>
              <Grid.Column width={4}>
                <em>Reminder date:</em>
              </Grid.Column>
              <Grid.Column>{this.props.remindDate}</Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4}>
                <em>Remind time: </em>
              </Grid.Column>
              <Grid.Column>{this.props.remindTime}</Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4}>
                <em>Remind message: </em>
              </Grid.Column>
              <Grid.Column>{this.props.remindMessage}</Grid.Column>
            </Grid.Row>
          </Grid>
        )

      case TicketChangeType.CHANGED_ASSIGNED_TO:
        return (
          <Grid columns={2} celled>
            <Grid.Row>
              <Grid.Column width={4}>
                <em>Was assigned to:</em>
              </Grid.Column>
              <Grid.Column>{this.props.assignedTo}</Grid.Column>
            </Grid.Row>
          </Grid>
        )

      case TicketChangeType.CHANGED_DESCRIPTION:
        return (
          <Grid columns={2} celled>
            <Grid.Row>
              <Grid.Column width={4}>
                <em>Description changed to:</em>
              </Grid.Column>
              <Grid.Column>{this.props.description}</Grid.Column>
            </Grid.Row>
          </Grid>
        )

      case TicketChangeType.CHANGED_STATUS:
        return (
          <Grid columns={2} celled>
            <Grid.Row>
              <Grid.Column width={4}>
                <em>Status changed to:</em>
              </Grid.Column>
              <Grid.Column>{lookupStatus(this.props.status)}</Grid.Column>
            </Grid.Row>
          </Grid>
        )

      case TicketChangeType.CHANGED_PRIORITY:
        return (
          <Grid columns={2} celled>
            <Grid.Row>
              <Grid.Column width={4}>
                <em>Priority was manually changed to:</em>
              </Grid.Column>
              <Grid.Column>{this.props.manualPriority}</Grid.Column>
            </Grid.Row>
          </Grid>
        )
      default:
        return null
    }
  }
}

