import * as React from 'react'
import styled from 'react-emotion'
import Modal from '../../components/shared/modals/MaterialModal'
import Toolbar from '../../components/taskmanager-toolbar/index'
import Tickets from '../../components/tickets/index'
import CreateNewTicket from '../../components/tickets/ticket/create-ticket/index'

import {
  createOptionsArray,
  HIGH_PRIORITY,
  IEX_TEAM_MEMBERS,
  TICKET_STATUS,
  LOW_PRIORITY,
  MEDIUM_PRIORITY,
  TYPE_CHATMSG,
  TYPE_CLAIM,
  TYPE_REMIND,
} from './types'

const Header = styled('div')({
  padding: '0 20px',
  textAlign: 'center',
})

const teamMemberOptions = createOptionsArray(IEX_TEAM_MEMBERS)
teamMemberOptions.push({
  text: 'Everyone',
  value: 'Everyone',
  key: 'Everyone',
})

const statusOptions = createOptionsArray(TICKET_STATUS)
statusOptions.push({
  text: 'All tickets',
  value: 'All',
  key: 'All',
})


export default class TaskManagerPageComponent extends React.Component {
  public state = {
    showModal: false,
    sortBy: 'priority', // by default
    sortOrder: 'DESC', // ""
    filterAssignedTo: 'Everyone',
    filterOnStatus: 'All',
    toolbarItems: [
      {
        label: 'Sort by Priority',
        itemType: 'button',
        clicked: (id) => this.changeSortByHandler(id),
        id: 'priority',
        hasCaret: true,
        caretDirection: 'DESC',
        isActive: true,
      },
      {
        label: 'Sort by Type',
        itemType: 'button',
        clicked: (id) => this.changeSortByHandler(id),
        id: 'type',
        hasCaret: true,
        caretDirection: 'DESC',
        isActive: false,
      },
      {
        label: 'Show only tickets assigned to: ',
        itemType: 'dropdown',
        clicked: (id) => this.filterByHandler(id),
        options: teamMemberOptions,
        handleChange: (id, value) => this.handleOptionsChange(id, value),
        id: 'assignedTo',
        hasCaret: false,
        isActive: false,
      },
      {
        label: 'Ticket status ',
        itemType: 'dropdown',
        clicked: (id) => this.filterByHandler(id),
        options: statusOptions,
        handleChange: (id, value) => this.handleOptionsChange(id, value),
        id: 'status',
        hasCaret: false,
        isActive: false,
      },
      {
        label: 'Create New Ticket',
        itemType: 'button',
        id: 'newTicket',
        clicked: () => this.showModal(),
        hasCaret: false,
        isActive: false,
        primary: true,
      },
    ],
  }

  public render() {
    return (
      <React.Fragment>
        <Header>
          <Toolbar items={this.state.toolbarItems} />
        </Header>
        <Modal open={this.state.showModal} handleClose={this.closeModal}>
          <CreateNewTicket closeModal={this.closeModal} />
        </Modal>
        <Tickets
          sortBy={this.state.sortBy}
          sortOrder={this.state.sortOrder}
          filterAssignedTo={this.state.filterAssignedTo}
          filterOnStatus={this.state.filterOnStatus}
          refresh={this.state.refreshTickets}
        />
      </React.Fragment>
    )
  }

  public changeSortByHandler(id) {
    let sortBy = id
    let sortOrder = this.changeOrder(id, this.state.sortBy, this.state.sortOrder)

    const itemsToUpdate = [...this.state.toolbarItems]
    const itemToUpdate = itemsToUpdate.filter((item,) => item.id === id)[0]

    for (let i = 0; i < itemsToUpdate.length; i++) {
      if (itemsToUpdate[i].id === id) {
        let newActiveItem = { ...itemsToUpdate[i], isActive: true, caretDirection: sortOrder} //just being explicit 
        itemsToUpdate[i] = newActiveItem 
      }
      if(id !== this.state.sortBy) {
        if(itemsToUpdate[i].id === this.state.sortBy){
          let deactivateItem = {...itemsToUpdate[i], isActive: false, } //need to deactivate the previously active item
          itemsToUpdate[i] = deactivateItem 
        }
      }
    }

    this.setState({
      sortBy,
      sortOrder: sortOrder,
      toolbarItems: itemsToUpdate,
    })
  }

  //Get back option value for selecting team members
  public handleOptionsChange(id, value) {
    switch (id) {
      case "status":
        this.setState({ filterOnStatus: value })
        break;

      case "assignedTo":
        this.setState({ filterAssignedTo: value })
        break;
      
      default: 
        return;
    }
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

  private closeModal = () => {
    this.setState({ showModal: false })
  }

  private showModal = () => {
    this.setState({ showModal: true })
  }
}

