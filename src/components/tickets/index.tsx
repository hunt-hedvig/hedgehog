import * as React from 'react'
import { Query } from 'react-apollo'
import Ticket from './ticket/index'
import { GET_TICKETS } from '../../features/taskmanager/queries'


export default class Tickets extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Query<any> query={GET_TICKETS} variables={{ request: 'GiveItToMe' }}>
          {({ data, error, loading }) => {
            if (loading) {
              return <p>Loading....</p>
            }
            if (error) {
              return (
                <p>
                  Error ! : {error.message.toString()}{' '}
                  {error.networkError.toString()}{' '}
                </p>
              )
            }
            //SORT AND FILTER THE TICKETS
            let sortedTickets = data.tickets
              .slice()
              .sort((a, b) => this.sortByPriority(a, b))
            if (this.props.sortBy === 'priority') {
              if (this.props.sortOrder === 'DESC') {
                sortedTickets = sortedTickets.sort((a, b) => {
                  return (
                    this.parsePriority(b.priority) -
                    this.parsePriority(a.priority)
                  )
                })
              } else if (this.props.sortOrder === 'ASC') {
                sortedTickets = sortedTickets.sort((a, b) => {
                  return (
                    this.parsePriority(a.priority) -
                    this.parsePriority(b.priority)
                  )
                })
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

  private changeOrder(newSortBy, oldSortBy, oldOrder) {
    let order = oldOrder
    if (newSortBy === oldSortBy) {
      order = oldOrder === 'ASC' ? 'DESC' : 'ASC'
    } else {
      order = 'DESC'
    }
    return order
  }

  // TODO: Move to util-file, also this is reverse of how the enum is defined in back-office
  private parsePriority(p) {
    switch (p) {
      case 'HIGH':
        return 2
      case 'MEDIUM':
        return 1
      case 'LOW':
        return 0
      default:
        return 0
    }
  }

  // use default lexical comparison
  private sortByType(a, b) {
    if (a.type > b.type) {
      return -1
    } else if (a.type == b.type) {
      return 0
    }
    return 1
  }
  // HIGH > MEDIUM > LOW (obviously)
  private sortByPriority(a, b) {
    this.parsePriority(b.priority) - this.parsePriority(a.priority)
  }
}
