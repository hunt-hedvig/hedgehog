export interface ITickets {
  sort: {
    order: EOrder
    category: string
  }
  filter: {
    assignedTo: string
    status: string
  }
}

export interface ITicket {
  id: string
  type: string
  assignedTo: string
  reminder?: IRemindNotification
  description: string
  status: string
  priority: number
}

export interface IRemindNotification {
  date: any
  time: any
  message: string
}

export enum EOrder {
  ASC,
  DESC,
}
