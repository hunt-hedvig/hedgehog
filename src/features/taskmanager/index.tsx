import * as React from 'react'
import styled from 'react-emotion'
import Modal from '../../components/shared/modals/MaterialModal'
import { Toolbar } from '../../components/taskmanager-toolbar/index'
import { IToolbarItem } from '../../components/taskmanager-toolbar/types'
import CreateNewTicket from '../../components/tickets/ticket/create-ticket/create-ticket'
import { Tickets } from '../../components/tickets/tickets'
import { EOrder } from '../../components/tickets/types'
import {
  createOptionsArray,
  IEX_TEAM_MEMBERS_OPTIONS,
  TICKET_STATUS,
  TICKET_TYPE_OPTIONS,
} from './types'



const Header = styled('div')({
  padding: '0 20px',
  textAlign: 'center',
})

const ticketTypeOptions = createOptionsArray(TICKET_TYPE_OPTIONS)
ticketTypeOptions.push({
  text: 'All types',
  value: 'All',
  key: 'All',
})

const teamMemberOptions = createOptionsArray(IEX_TEAM_MEMBERS_OPTIONS)
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
    type: string
  }
  toolbarItems: IToolbarItem[]
}

export default class TaskManagerPageComponent extends React.Component<
  {},
  ITaskManagerState
> {
  public state = {
    showModal: false,
    sort: {
      category: 'priority',
      order: EOrder.DESC,
    },
    filter: {
      assignedTo: 'Everyone',
      status: 'All',
      type: 'All',
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
        itemType: 'dropdown',
        label: 'Filter by Type: ',
        active: false,
        behaviors: {
          handleChange: (id, value) => this.handleOptionsChange(id, value),
        },
        options: ticketTypeOptions,
      },
      {
        id: 'assignedTo',
        itemType: 'dropdown',
        label: 'Show only tickets assigned to: ',
        active: false,
        behaviors: {
          handleChange: (id, value) => this.handleOptionsChange(id, value),
        },
        options: teamMemberOptions,
      },
      {
        id: 'status',
        itemType: 'dropdown',
        label: 'Ticket status: ',
        active: false,
        behaviors: {
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

////////////////////
    console.log(this.props)
    
//////////////////

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

    const toolbarItemsToUpdate = this.state.toolbarItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isActive: true,
          caret: { direction: sortOrder },
        }
      }
      if (
        id !== this.state.sort.category &&
        item.id === this.state.sort.category
      ) {
        return {
          ...item,
          isActive: false,
        }
      }

      return { ...item }
    })
    const sort = {
      ...this.state.sort,
      order: sortOrder,
      category: sortCategory,
    }

    this.setState({
      sort,
      toolbarItems: toolbarItemsToUpdate,
    })
  }

  public handleOptionsChange = (id: string, value: string): void => {
    // Change what we filter the tickets on:
    if (id === 'status' || id === 'assignedTo' || id === 'type') {
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
