import * as React from 'react'
import { Query } from 'react-apollo'
import { GET_TICKETS, ME } from '../../features/taskmanager/queries'
import Ticket from './ticket/ticket'

import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import isAfter from 'date-fns/isAfter'
import isSameDay from 'date-fns/isSameDay'
import parse from 'date-fns/parse'
import { EOrder, ITickets } from './types'

export default class Tickets extends React.Component<ITickets, {}> {
  public state = {
    remindersHaveBeenProcessed: false,
    me: {
      email: '',
    },
  }
  public componentDidMount() {
    // Make sure to not process reminders again when sorting tickets
    this.setState({ remindersHaveBeenProcessed: true })
  }

  public render() {
    return (
      <React.Fragment>
        <Query<any> query={ME}>
          {({ data, error, loading }) => {
            this.state.me.email = data.me
            return null
          }}
        </Query>
        <Query<any> query={GET_TICKETS}>
          {({ data, error, loading }) => {
            if (loading) {
              return <p>...FETCHING TICKETS...</p>
            }
            if (error) {
              return (
                <p>
                  Error ! : {error.message.toString()}{' '}
                  {error.networkError.toString()}{' '}
                </p>
              )
            }
            // Set up Notifications
            if (!this.state.remindersHaveBeenProcessed) {
              const [
                overdueNotifications,
                upcomingNotifications,
              ] = this.processReminders(data.tickets)
              // @TODO Present notifications that are overdue (unresolved tickets)

              if (upcomingNotifications.length > 0) {
                this.createNotifications(upcomingNotifications)
              }
            }

            // SORT AND FILTER THE TICKETS
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
            } else if (this.props.sort.category === 'type') {
              if (this.props.sort.order === EOrder.ASC) {
                sortedTickets = sortedTickets.sort((a, b) =>
                  this.sortByType(a, b),
                )
              } else if (this.props.sort.order === EOrder.DESC) {
                sortedTickets = sortedTickets.sort((a, b) =>
                  this.sortByType(b, a),
                )
              }
            }

            if (
              this.props.filter.assignedTo !== 'Everyone' &&
              this.props.filter.assignedTo !== ''
            ) {
              sortedTickets = sortedTickets.filter(
                (ticket) => ticket.assignedTo === this.props.filter.assignedTo,
              )
            }

            if (
              this.props.filter.status !== 'All' &&
              this.props.filter.status !== ''
            ) {
              sortedTickets = sortedTickets.filter(
                (ticket) => ticket.status === this.props.filter.status,
              )
            }

            return (
              <>
                {sortedTickets.map((ticket) => (
                  <Ticket
                    key={ticket.id}
                    reminder={{
                      date: ticket.remindNotificationDate,
                      time: ticket.remindNotificationTime,
                      message: ticket.remindMessage,
                    }}
                    {...ticket}
                  />
                ))}
              </>
            )
          }}
        </Query>
      </React.Fragment>
    )
  }

  private processReminders(tickets) {
    // Select tickets that have been assigned to me, not been resolved and that are overdue or due for today.
    // Ignore tickets further in the future...
    const today = new Date()
    const me = this.state.me.email
    const unresolvedTickets = tickets.filter((ticket) => {
      return (
        ticket.assignedTo === me &&
        ticket.status !== 'RESOLVED' &&
        !isAfter(
          parse(ticket.remindNotificationDate, 'yyyy-MM-dd', today),
          today,
        )
      )
    })

    const overdueReminders = []
    const upcomingRemindersToday = []

    for (let i = 0; i < unresolvedTickets.length; i++) {
      if (
        isSameDay(
          parse(
            unresolvedTickets[i].remindNotificationDate,
            'yyyy-MM-dd',
            today,
          ),
          today,
        ) &&
        isAfter(
          parse(unresolvedTickets[i].remindNotificationTime, 'HH:mm:ss', today),
          today,
        )
      ) {
        upcomingRemindersToday.push(unresolvedTickets[i])
      } else {
        overdueReminders.push(unresolvedTickets[i])
      }
    }
    return [overdueReminders, upcomingRemindersToday]
  }

  // These must be reminders that will fire later today...
  private createNotifications(reminders) {
    const now = new Date()
    for (let i = 0; i < reminders.length; i++) {
      const msUntilFire = differenceInMilliseconds(
        parse(reminders[i].remindNotificationTime, 'HH:mm:ss', now),
        now,
      )
      setTimeout(() => {
        new Notification('Ticket Reminder', {
          silent: true,
          body: reminders[i].remindMessage,
          icon: null,
          requireInteraction: true,
        })
      }, msUntilFire)
    }
  }

  private sortByType(a, b): number {
    // use default lexical comparison
    if (a.type > b.type) {
      return -1
    } else if (a.type == b.type) {
      return 0
    }
    return 1
  }

  // HIGH > MEDIUM > LOW (obviously)
  private sortByPriority(a, b): number {
    const evaluate = a.priority - b.priority
    if (evaluate > 0) {
      return -1
    } else if (evaluate === 0) {
      return 0
    }
    return 1
  }
}
