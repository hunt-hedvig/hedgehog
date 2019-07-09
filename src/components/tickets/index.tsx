import * as React from 'react'
import { Query } from 'react-apollo'
import Ticket from './ticket/index'
import { GET_TICKETS, ME } from '../../features/taskmanager/queries'
import Notifier from '../taskmanager-notifications/index'

import isSameDay from 'date-fns/isSameDay'
import isBefore from 'date-fns/isBefore'
import isAfter from 'date-fns/isAfter'
import parse from 'date-fns/parse'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'


export default class Tickets extends React.Component {
  state = {
    remindersHaveBeenProcessed: false, 
    me: {
      email:"",
  },
 }
  componentDidMount(){
    //Make sure to not process reminders again when sorting tickets
    this.setState({remindersHaveBeenProcessed: true })
  }

  public render() {
    // console.log("Reminders have been processed: " + this.state.remindersHaveBeenProcessed)
    return (
      <React.Fragment>
        <Query<any> query={ME} > 
          {({data, error, loading}) => {
            this.state.me.email = data.me
            return null
          }
        }
        </Query>
        <Query<any> query={GET_TICKETS} >
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
             //Set up Notifications
            if(!this.state.remindersHaveBeenProcessed){
              let [overdueNotifications, upcomingNotifications ] = this.processReminders(data.tickets)
                         
              if(upcomingNotifications.length > 0 ) {
                this.createNotifications(upcomingNotifications)
              }
            }
            
            //@TODO Present notifications that are overdue (unresolved tickets)
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
    console.log("PROCESSING REMINDERS")
    //Select tickets that have been assigned to me, not been resolved and that are overdue or due for today.
    //Ignore tickets further in the future...
    const today = new Date() 
    const me = this.state.me.email
    const unresolvedTickets = tickets.filter( ticket => {
          return ticket.assignedTo === me 
          &&  
          ticket.status !== 'RESOLVED'
          &&  !isAfter(parse(ticket.remindNotificationDate, 'yyyy-MM-dd', today), today)
    } )

    const overdueReminders = []
    const upcomingRemindersToday = []
    
    for (var i = 0 ; i <unresolvedTickets.length ; i++) {
      if ( 
        isSameDay( parse(unresolvedTickets[i].remindNotificationDate, 'yyyy-MM-dd', today), today)
        &&
        isAfter( parse(unresolvedTickets[i].remindNotificationTime, 'HH:mm:ss',today), today)
        ) 
      {
        upcomingRemindersToday.push(unresolvedTickets[i])
      } 
      else {
        overdueReminders.push(unresolvedTickets[i])
      }
    }
    return [overdueReminders, upcomingRemindersToday]
  } 


  //These must be reminders that will fire later today...
  private createNotifications(reminders) {
    console.log("[Creating Notifications]")

    let now = new Date()
    for (let i = 0; i < reminders.length ; i++ ) {
      let msUntilFire = differenceInMilliseconds(parse(reminders[i].remindNotificationTime, 'HH:mm:ss', now), now)
      console.log(msUntilFire)
       setTimeout( () => {
           new Notification( 'Ticket Reminder',{
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
