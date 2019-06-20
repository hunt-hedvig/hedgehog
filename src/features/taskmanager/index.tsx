// import { colors } from '@hedviginsurance/brand'
import gql from 'graphql-tag'
import * as React from 'react'
import { Query } from 'react-apollo'
import styled from 'react-emotion'

import Toolbar from '../../components/taskmanager-toolbar/index'
import Ticket from '../../components/ticket/ticket'
import Modal from '../../components/shared/modals/MaterialModal'
import { GET_TICKETS } from './queries'

import CreateNewTicket from '../../components/ticket/create-ticket/index'


const Header = styled('div')({
  padding: '0 20px',
  textAlign: 'center',
})

//TODO::: MOVE TO type.ts
export const LOW_PRIORITY = 0
export const MEDIUM_PRIORITY = 1
export const HIGH_PRIORITY = 2

export const TYPE_CHATMSG = 'Chat message'
export const TYPE_REMIND = 'Remind'
export const TYPE_CLAIM = 'Claim'

export default class TaskManagerPageComponent extends React.Component {
  public state = {
    showModal: false,
    infoText: 'Default',
    sortBy: 'priority', // by default
    sortOrder: 'DESC', // ""
    toolbarItems: [
      {
        label: 'Sort by Priority',
        clicked: (id) => this.changeSortbyHandler(id),
        id: 'priority',
        hasCaret: true,
        caretDirection: 'DESC',
        isActive: true,
      },
      {
        label: 'Sort by Type',
        clicked: (id) => this.changeSortbyHandler(id),
        id: 'type',
        hasCaret: true,
        caretDirection: 'DESC',
        isActive: false,
      },
      {
        label: 'Show only tickets assigned to',
        clicked: (id) => this.filterByHandler(id),
        values: 
        id: 'assignedTo',
        hasCaret: false,
        isActive: false,
      },
      {
        label: 'Create New Ticket',
        id: 'newTicket',
        clicked: () => this.showModal(),
        hasCaret: false,
        isActive: false,
      },
    ]
  }


  public render() {
    return (
      <React.Fragment>
       

        <Header>
          {/* <h1>Task Manager</h1> */}
          {/* <h2>Current Tickets</h2> */}
          <Toolbar items={this.state.toolbarItems} />
          <p>{this.state.infoText}</p>
          <Query<any> query={GET_TICKETS} variables={{ request: 'WHATEFVER' }}>
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
              let sortedTickets = data.tickets
                .slice()
                .sort((a, b) => this.sortByPriority(a, b))
              if (this.state.sortBy === 'priority') {
                if (this.state.sortOrder === 'DESC') {
                  sortedTickets = sortedTickets.sort((a, b) => {
                    return (
                      this.parsePriority(b.priority) -
                      this.parsePriority(a.priority)
                    )
                  })
                } else if (this.state.sortOrder === 'ASC') {
                  sortedTickets = sortedTickets.sort((a, b) => {
                    return (
                      this.parsePriority(a.priority) -
                      this.parsePriority(b.priority)
                    )
                  })
                }
              } else if (this.state.sortBy === 'type') {
                if (this.state.sortOrder === 'ASC') {
                  sortedTickets = sortedTickets.sort((a, b) => b.type > a.type)
                } else if (this.state.sortOrder === 'DESC') {
                  sortedTickets = sortedTickets.sort((a, b) => a.type > b.type)
                }
              }
              return (
                <>
                <Modal open={this.state.showModal} handleClose={this.closeModal}><CreateNewTicket closeModal={this.closeModal}/></Modal>

                  {sortedTickets.map((ticket) => (
                    <Ticket key={ticket.id} {...ticket}/>
                  ))}
                </>
              )
            }}
          </Query>
        </Header>
      </React.Fragment>
    )
  }

  public changeSortbyHandler(id) {
    let sortBy = this.state.sortBy
    let order = this.state.sortOrder
    switch (id) {
      case 'priority':
      case 'type':
          order = this.changeOrder(id, this.state.sortBy, order)
          sortBy = id
        break
      default:
        return
    }

    const updatedItems = [...this.state.toolbarItems]
    const correctItem = updatedItems.filter( item => item.id === id)[0]
    const newActiveItem = {...correctItem}
    newActiveItem['isActive'] = true
    newActiveItem['caretDirection'] = order
    //TODO: @Refactor Could remember the index to avoid iterating through the array again -make own func
    for (let i = 0; i < updatedItems.length ; i++) {
      if (updatedItems[i].id === id ){
        updatedItems[i] = newActiveItem 
      }
    }
    if(id !== this.state.sortBy){
      const correctItem = updatedItems.filter(item => item.id === this.state.sortBy)[0]
      const oldActiveItem = {...correctItem}
      oldActiveItem['isActive'] = false
      for (let i = 0; i < updatedItems.length ; i++) {
      if (updatedItems[i].id === oldActiveItem.id){
          updatedItems[i] = oldActiveItem 
      }
    }
    }
    const infoText = 'sorting by ' + sortBy + ' ' + order
    this.setState({ sortBy, infoText, sortOrder: order, toolbarItems: updatedItems })
  }

  private changeOrder(newSortBy, oldSortBy, oldOrder) {
    let order = oldOrder
    if (newSortBy === oldSortBy) {
      order = (oldOrder === 'ASC') ? 'DESC' : 'ASC'
    } else {
      order = 'DESC'
    }
    return order
  }

  // TODO: Move to util-file
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
    return a.type < b.type
  }

  // HIGH > MEDIUM > LOW (obviously)
  private sortByPriority(a, b) {
    this.parsePriority(b.priority) - this.parsePriority(a.priority)
  }

  private closeModal = () => {
    this.setState({ showModal: false })
  }

  private showModal = () => {
   this.setState({showModal: true})
  } 

}
