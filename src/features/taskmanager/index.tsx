import * as React from 'react'
import styled from 'react-emotion'
import Modal from '../../components/shared/modals/MaterialModal'
import Toolbar from '../../components/taskmanager-toolbar/index'
import Tickets from '../../components/tickets/tickets'

import CreateNewTicket from '../../components/tickets/ticket/create-ticket/create-ticket'

import { IToolbarItem } from '../../components/taskmanager-toolbar/types'
import { EOrder } from '../../components/tickets/types' 
import { createOptionsArray, IEX_TEAM_MEMBERS, TICKET_STATUS } from './types'

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

interface ITaskManagerState {
  showModal: boolean
  sort: {
    category: string
    order: EOrder
  }
  filter: {
    assignedTo: string
    status: string
  }
  toolbarItems: IToolbarItem[]
}

export default class TaskManagerPageComponent extends React.Component <{}, ITaskManagerState> {
  public state = {
    showModal: false,
    sort: {
      category: 'priority',
      order: EOrder.DESC,
    },
    filter: {
      assignedTo: 'Everyone',
      status: 'All',
    },
    toolbarItems: [
      {
        id: 'priority',
        itemType: 'sortingButton',
        label: 'Sort by Priority',
        active: true,
        caret: {
          direction: EOrder.DESC,
        },
        behaviors: {
          onClicked: (id) => this.changeSortByHandler(id),
        },
      },
      {
        id: 'type',
        itemType: 'sortingButton',
        label: 'Sort by Type',
        active: false,
        behaviors: {
          onClicked: (id) => this.changeSortByHandler(id),
        },
        caret: {
          direction: EOrder.DESC,
        },
      },
      {
        id: 'assignedTo',
        itemType: 'dropdown',
        label: 'Show only tickets assigned to: ',
        active: false,
        behaviors: {
          onClicked: (id) => this.filterByHandler(id),
          handleChange: (id, value) => this.handleOptionsChange(id, value),
        },
        options: teamMemberOptions,
      },
      {
        id: 'status',
        itemType: 'dropdown',
        label: 'Ticket status ',
        active: false,
        behaviors: {
          onClicked: (id) => this.filterByHandler(id),
          handleChange: (id, value) => this.handleOptionsChange(id, value),
        },
        options: statusOptions,
      },
      {
        id: 'newTicket',
        itemType: 'button',
        label: 'Create New Ticket',
        active: false,
        primary: true,
        behaviors: {
          onClicked: () => this.showModal(),
        },
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
        <Tickets sort={this.state.sort} filter={this.state.filter} />
      </React.Fragment>
    )
  }

  public changeSortByHandler = (id: string): void => {
    const sortCategory = id
    const sortOrder = this.changeOrder(
      id,
      this.state.sort.category,
      this.state.sort.order,
    )

    const toolbarItemsToUpdate = [...this.state.toolbarItems]

    for (let i = 0; i < toolbarItemsToUpdate.length; i++) {
      if (toolbarItemsToUpdate[i].id === id) {
        const newActiveItem = {
          ...toolbarItemsToUpdate[i],
          isActive: true,
          caret: { direction: sortOrder },
        }
        toolbarItemsToUpdate[i] = newActiveItem
      }
      if (id !== this.state.sort.category) {
        if (toolbarItemsToUpdate[i].id === this.state.sort.category) {
          const deactivateItem = { ...toolbarItemsToUpdate[i], isActive: false } // need to deactivate the previously active item
          toolbarItemsToUpdate[i] = deactivateItem
        }
      }
    }

    const sort = { ...this.state.sort }
    sort.order = sortOrder
    sort.category = sortCategory

    this.setState({
      sort,
      toolbarItems: toolbarItemsToUpdate,
    })
  }

  public handleOptionsChange = (id: string, value: string): void => {
    // Change what we filter the tickets on:
    if (id === 'status' || id === 'assignedTo') {
      const filter = { ...this.state.filter }
      filter[id] = value
      this.setState({ filter })
    }
  }

  private changeOrder = (
    newCategory: string,
    oldCategory: string,
    oldOrder: EOrder,
  ): EOrder => {
    if (newCategory !== oldCategory) {
      return EOrder.DESC // Sort in DESC is default when switching category
    }
    return oldOrder === EOrder.ASC ? EOrder.DESC : EOrder.ASC // we just want to switch the order, not the category
  }

  private closeModal = (): void => {
    this.setState({ showModal: false })
  }

  private showModal = (): void => {
    this.setState({ showModal: true })
  }
}
