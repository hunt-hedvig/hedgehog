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
import {
    IEX_TEAM_MEMBERS, 
    createOptionsArray,
    LOW_PRIORITY,
    MEDIUM_PRIORITY,
    HIGH_PRIORITY,
    TYPE_CHATMSG,
    TYPE_REMIND,
    TYPE_CLAIM,
    } from './types'


const Header = styled('div')({
  padding: '0 20px',
  textAlign: 'center',
})


const team_member_options = createOptionsArray(IEX_TEAM_MEMBERS)
team_member_options.push({ text:'Everyone', value:'Everyone', key:'Everyone' }) 


export default class TaskManagerPageComponent extends React.Component {
  public state = {
    showModal: false,
    infoText: 'Default',
    sortBy: 'priority', // by default
    sortOrder: 'DESC', // ""
    filterAssignedTo: "Everyone",
    toolbarItems: [
      {
        label: 'Sort by Priority',
        inputType: 'button',
        clicked: (id) => this.changeSortByHandler(id),
        id: 'priority',
        hasCaret: true,
        caretDirection: 'DESC',
        isActive: true,
      },
      {
        label: 'Sort by Type',
        inputType: 'button',
        clicked: (id) => this.changeSortByHandler(id),
        id: 'type',
        hasCaret: true,
        caretDirection: 'DESC',
        isActive: false,
      },
      {
        label: 'Show only tickets assigned to: ',
        inputType: 'dropdown',
        clicked: (id) => this.filterByHandler(id),
        options: team_member_options,
        handleChange: (id, value) => this.handleOptionsChange(id, value),
        id: 'assignedTo',
        hasCaret: false,
        isActive: false,
      },
      {
        label: 'Create New Ticket',
        inputType: 'button',
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
                  sortedTickets = sortedTickets.sort((a, b) => this.sortByType(a,b))
                } else if (this.state.sortOrder === 'DESC') {
                  sortedTickets = sortedTickets.sort((a, b) =>  this.sortByType(b,a))
                }
              }

              if (this.state.filterAssignedTo !== 'Everyone' && this.state.filterAssignedTo !== ""){
           
                sortedTickets = sortedTickets.filter( ticket => ticket.assignedTo == this.state.filterAssignedTo ) 
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

  public changeSortByHandler(id) {
    let sortBy 
    let sortOrder     
    switch (id) {
      case 'priority':
      case 'type':
          sortOrder = this.changeOrder(id, this.state.sortBy, this.state.sortOrder)
          sortBy = id
        break
      default:
        return
    }

    const updatedItems = [...this.state.toolbarItems]
    const correctItem = updatedItems.filter( item => item.id === id)[0]
    const newActiveItem = {...correctItem}
    newActiveItem['isActive'] = true
    newActiveItem['caretDirection'] = sortOrder
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
    const infoText = 'sorting by ' + sortBy + ' ' + sortOrder
  
    this.setState({ sortBy, infoText, sortOrder: sortOrder, toolbarItems: updatedItems })
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
    if (a.type > b.type ) {
      return -1
    }
    else if (a.type == b.type) {
      return 0
    }
    return 1
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

 //Get back option value for selecting team members 
  public handleOptionsChange  (id, value) {
    
    
    
    this.setState( {filterAssignedTo: value})
  }

}
