import { TicketStatus, TicketType } from '../../features/taskmanager/types'

export interface ITickets {
  sort: {
    order: EOrder
    category: string
  }
  filter: {
    assignedTo: string
    status: string
    type: string
    claimId: string
  }
}

export interface ITicket {
  id: string
  type: TicketType
  assignedTo: string
  reminder?: IRemindNotification
  description: string
  status: TicketStatus
  priority: number
  overdue: boolean
  memberId?: string
}

export interface IRemindNotification {
  date: any
  time: any
  message: string
  assignedTo: string
}

export enum EOrder {
  ASC,
  DESC,
}
