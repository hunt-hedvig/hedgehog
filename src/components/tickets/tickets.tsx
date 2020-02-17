// @ts-nocheck
import { isAfter, isBefore } from 'date-fns'
import isSameDay from 'date-fns/isSameDay'
import parse from 'date-fns/parse'
import { GET_TICKETS, ME } from 'features/taskmanager/queries'
import { TicketStatus } from 'features/taskmanager/types'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Ticket } from './ticket/ticket'
import { EOrder, ITickets } from './types'

export class Tickets extends React.Component<ITickets, {}> {
  public state = {
    remindersHaveBeenProcessed: false,
    remindersWeHaveSeen: {},
    me: {
      email: '',
    },
  }

  public componentDidMount() {
    this.setState({ remindersHaveBeenProcessed: true })
  }

  public render() {
    return (
      <>
        <Query query={ME}>
          {({ data, error, loading }) => {
            if (loading) {
              return <div>Loading</div>
            }

            if (error) {
              return (
                <div>
                  Error: <pre>{JSON.stringify(error, null, 2)}</pre>
                </div>
              )
            }
            this.state.me.email = data.me
            return null
          }}
        </Query>

        <Query<any>
          query={GET_TICKETS}
          variables={{
            onlyResolvedTickets:
              this.props.filter.status === TicketStatus.RESOLVED,
          }}
          pollInterval={3000}
        >
          {({ data, error, loading }) => {
            if (loading) {
              return <p>Fetching tickets... </p>
            }
            if (error) {
              return (
                <p>
                  Error ! : {error.message} {error.networkError}{' '}
                </p>
              )
            }

            let sortedTickets = data.tickets.slice().sort()

            if (this.props.sort.category === 'priority') {
              if (this.props.sort.order === EOrder.DESC) {
                sortedTickets = sortedTickets.sort((a, b) =>
                  this.sortByPriority(a, b),
                )
              } else if (this.props.sort.order === EOrder.ASC) {
                sortedTickets = sortedTickets.sort((a, b) =>
                  this.sortByPriority(b, a),
                )
              }
            }

            const filteredTickets = this.applyFilters(sortedTickets)

            return (
              <>
                {filteredTickets.map((ticket) => (
                  <Ticket
                    key={ticket.id}
                    overdue={this.isOverdue(
                      ticket.remindNotificationDate,
                      ticket.remindNotificationTime,
                    )}
                    reminder={{
                      date: ticket.remindNotificationDate,
                      time: ticket.remindNotificationTime,
                      message: ticket.remindMessage,
                    }}
                    memberId={ticket.memberId}
                    me={this.state.me.email}
                    {...ticket}
                  />
                ))}
              </>
            )
          }}
        </Query>
      </>
    )
  }

  private isOverdue = (date, time) => {
    if (date === null || time === null) {
      return false
    }

    const today = new Date()
    const reminderDate: Date = parse(date, 'yyyy-MM-dd', today)
    const reminderTime: Date = parse(time, 'HH:mm:ss', today)

    if (isAfter(reminderDate, today)) {
      return false
    }
    if (isSameDay(reminderDate, today) && isAfter(reminderTime, today)) {
      return false
    }
    return true
  }

  private applyFilters = (sortedTickets: any[]): any[] => {
    let filteredTickets = [...sortedTickets]
    if (
      this.props.filter.assignedTo !== 'Everyone' &&
      this.props.filter.assignedTo !== ''
    ) {
      filteredTickets = filteredTickets.filter(
        (ticket) => ticket.assignedTo === this.props.filter.assignedTo,
      )
    }

    if (this.props.filter.status !== 'All' && this.props.filter.status !== '') {
      filteredTickets = filteredTickets.filter(
        (ticket) => ticket.status === this.props.filter.status,
      )
    }

    if (this.props.filter.type !== 'All' && this.props.filter.type !== '') {
      filteredTickets = filteredTickets.filter(
        (ticket) => ticket.type === this.props.filter.type,
      )
    }

    if (
      this.props.filter.referenceId !== 'All' &&
      this.props.filter.referenceId !== ''
    ) {
      filteredTickets = filteredTickets.filter(
        (ticket) => ticket.referenceId === this.props.filter.referenceId,
      )
    }

    if (
      this.props.filter.memberId !== 'All' &&
      this.props.filter.memberId !== ''
    ) {
      filteredTickets = filteredTickets.filter(
        (ticket) => ticket.memberId === this.props.filter.memberId,
      )
    }
    return filteredTickets
  }

  private sortByPriority = (a, b): number => {
    const evaluate = a.priority - b.priority
    if (evaluate > 0) {
      return -1
    } else if (evaluate === 0) {
      return 0
    }
    return 1
  }
}
