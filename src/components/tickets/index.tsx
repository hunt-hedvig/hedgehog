import * as React from 'react'
import { Query } from 'react-apollo'
import Ticket from './ticket/index'
import { GET_TICKETS } from '../../features/taskmanager/queries'
import Notifier from '../taskmanager-notifications/index'
import isSameDay from 'date-fns/isSameDay'
import isBefore from 'date-fns/isBefore'
import isAfter from 'date-fns/isAfter'
import parse from 'date-fns/parse'

export default class Tickets extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Query<any> query={GET_TICKETS} variables={{ request: 'GiveItToMe' }}>
          {({ data, error, loading }) => {
            if (loading) {
              return <p>...FETCHING DEM TICKETS...</p>
            }
            if (error) {
              return (
                <p>
                  Error ! : {error.message.toString()}{' '}
                  {error.networkError.toString()}{' '}
                </p>
              )
            }
             //Set up Notifications
            this.processReminders(data.tickets)


            //SORT AND FILTER THE TICKETS
            let sortedTickets = data.tickets
              .slice()
              .sort()
              // .sort((a, b) => this.sortByPriority(a, b))
            if (this.props.sortBy === 'priority') {
              if (this.props.sortOrder === 'DESC') {
                sortedTickets = sortedTickets.sort((a, b) => this.sortByPriority(a,b))
              } else if (this.props.sortOrder === 'ASC') {
                sortedTickets = sortedTickets.sort((a, b) => this.sortByPriority(b,a))
              }
            } else if (this.props.sortBy === 'type') {
              if (this.props.sortOrder === 'ASC') {
                sortedTickets = sortedTickets.sort((a, b) =>
                  this.sortByType(a, b),
                )
              } else if (this.props.sortOrder === 'DESC') {
                sortedTickets = sortedTickets.sort((a, b) =>
                  this.sortByType(b, a),
                )
              }
            }

            if (
              this.props.filterAssignedTo !== 'Everyone' &&
              this.props.filterAssignedTo !== ''
            ) {
              sortedTickets = sortedTickets.filter(
                (ticket) => ticket.assignedTo == this.props.filterAssignedTo,
              )
            }

            if (
              this.props.filterOnStatus !== 'All' &&
              this.props.filterOnStatus !== ''
            ) {
              sortedTickets = sortedTickets.filter(
                (ticket) => ticket.status == this.props.filterOnStatus,
              )
            }

            return (
              <>
             {/* <Notifier notifications={true}/> */}
                {sortedTickets.map((ticket) => (
                  <Ticket key={ticket.id} {...ticket} />
                ))}
              </>
            )
          }}
        </Query>
      </React.Fragment>
    )
  }

  private changeOrder(newSortBy, oldSortBy, oldOrder): string {
    let order = oldOrder
    if (newSortBy === oldSortBy) {
      order = oldOrder === 'ASC' ? 'DESC' : 'ASC'
    } else {
      order = 'DESC'
    }
    return order
  }

  private processReminders(tickets) {
    const today = new Date() 
    // const remindersToday = tickets.filter( ticket => {
    //     return ( 
    //     isSameDay(   parse(ticket.remindNotificationDate,'yyyy-MM-dd', today ),today)
    //     && 
    //     isBefore(today, parse(ticket.remindNotificationTime, 'HH:mm:ss', today) )
    //     &&
    //     ticket.status !== 'RESOLVED'
    //     )
    // } )

    //Select tickets that have not been resolved and that are overdue or due for today.
    //Ignore tickets further in the future...
    const unresolvedTickets = tickets.filter( ticket => {
          return ticket.status !== 'RESOLVED'
          &&  !isAfter(parse(ticket.remindNotificationDate, 'yyyy-MM-dd', today), today)
        } )

    const overdueReminders = []
    const upcomingRemindersToday = []
    
    // for (let i; i < unresolvedTickets.length; i++) {
    
      // console.log(unresolvedTickets)
      for (var i = 0 ; i <unresolvedTickets.length ; i++) {
        if ( 
          isSameDay( parse(unresolvedTickets[i].remindNotificationDate, 'yyyy-MM-dd', today), today)
          &&
          isAfter( parse(unresolvedTickets[i].remindNotificationTime, 'HH:mm:ss',today), today)
          ) 
        {
          // console.log(unresolvedTickets[i])
          upcomingRemindersToday.push(unresolvedTickets[i])
        } 
        else {
          overdueReminders.push(unresolvedTickets[i])
        }
      }

    // console.log("OVERDUE:")
    // console.log(overdueReminders)
    // console.log("UPCOMING:")
    // console.log(upcomingRemindersToday)

  } 

  // use default lexical comparison
  private sortByType(a, b): number {
    if (a.type > b.type) {
      return -1
    } else if (a.type == b.type) {
      return 0
    }
    return 1
  }
  
  // HIGH > MEDIUM > LOW (obviously)
  private sortByPriority(a, b): number {
    let evaluate = a.priority - b.priority 
    if (evaluate > 0 ){
      return -1
    }
    else if (evaluate === 0 ) {
      return 0
    } 
    return 1 
  }
}
