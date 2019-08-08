import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import isAfter from 'date-fns/isAfter'
import isSameDay from 'date-fns/isSameDay'
import parse from 'date-fns/parse'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Dimmer, Loader } from 'semantic-ui-react'
import { GET_TICKETS, ME } from '../../features/taskmanager/queries'
import { Ticket } from './ticket/ticket'
import { EOrder, ITickets } from './types'
import {TicketStatus } from '../../features/taskmanager/types'

export class Tickets extends React.Component<ITickets, {}> {
  public state = {
    remindersHaveBeenProcessed: false,
    remindersWeHaveSeen: {},
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
      <>
        <Query<any> query={ME}>
          {({ data, error, loading }) => {
            this.state.me.email = data.me
            return null
          }}
        </Query>
        <Query<any> 
          query={GET_TICKETS} 
          variables={{onlyResolvedTickets: (this.props.filter.status == TicketStatus.RESOLVED)}} 
          pollInterval={1000}>
          
          {({ data, error, loading }) => {
            if (loading) {
              return (
                <Dimmer active>
                  {' '}
                  <Loader size="big">Fetching tickets</Loader>
                </Dimmer>
              )
            }
            if (error) {
              return (
                <p>
                  Error ! : {error.message} {error.networkError}{' '}
                </p>
              )
            }

            // Set up Notifications
            const [
              overdueNotifications,
              upcomingNotifications,
            ] = this.processReminders(data.tickets)

            if (upcomingNotifications.length > 0) {
              this.createNotifications(upcomingNotifications)
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
            }

            const filteredTickets = this.applyFilters(sortedTickets)

            return (
              <>
                {filteredTickets.map((ticket) => (
                  <Ticket
                    key={ticket.id}
                    overdue={ticket.id in overdueNotifications}
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
      </>
    )
  }

  private processReminders = (tickets) => {
    // Select tickets that:
    // a) have been assigned to me,
    // b)  not been resolved and
    // c)  that are overdue or due for today.
    // Ignore tickets further in the future...
    const today = new Date()
    const me = this.state.me.email
    const unresolvedTickets = tickets.filter((ticket) => {
      return (
        ticket.assignedTo === me &&
        ticket.status !== 'RESOLVED' &&
        ticket.remindNotificationDate !== null &&
        !isAfter(
          parse(ticket.remindNotificationDate, 'yyyy-MM-dd', today),
          today,
        )
      )
    })

    let overdueReminders = {}
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
        ) &&
        !(
          this.generateReminderId(
            unresolvedTickets[i].id,
            unresolvedTickets[i].remindNotificationDate,
            unresolvedTickets[i].remindNotificationDate,
          ) in this.state.remindersWeHaveSeen
        )
      ) {
        upcomingRemindersToday.push(unresolvedTickets[i])
      } else {
        // Just keep track of the id of the tickets that are overdue
        overdueReminders = {
          ...overdueReminders,
          [unresolvedTickets[i].id]: true,
        }
      }
    }
    return [overdueReminders, upcomingRemindersToday]
  }

  // createNotifications takes @reminders that will fire later today...
  private createNotifications = (reminders: any[]): void => {
    const now = new Date()
    for (let i = 0; i < reminders.length; i++) {
      Object.defineProperty(
        this.state.remindersWeHaveSeen,
        this.generateReminderId(
          reminders[i].id,
          reminders[i].remindNotificationDate,
          reminders[i].remindNotificationTime,
        ),
        { value: null },
      )
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

  private generateReminderId = (ticketId, date, time): string => {
    return ticketId + date.toString() + time.toString()
  }
}
