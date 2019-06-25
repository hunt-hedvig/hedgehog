import gql from 'graphql-tag'

  // createTicket ( assignedTo: String, createdBy: String, priority: TicketPriority, remindNotificationDate: LocalDate, description: String) : ID

export const CREATE_TICKET = gql`
  mutation CreateTicket (
      $assignedTo: String,
      $createdBy: String,
      $priority: TicketPriority,
      $remindNotificationDate: LocalDate,
      $remindNotificationTime: LocalTime,
      $description: String)
   {
    createTicket (
        assignedTo: $assignedTo,
        createdBy: $createdBy,
        priority: $priority,
        remindNotificationDate: $remindNotificationDate,
        remindNotificationTime: $remindNotificationTime,
        description: $description 
    ){
      id 
      description
      assignedTo
      type
      status
      priority
      remindNotificationDate
      remindNotificationTime
    }
  }
`
export const GET_TICKETS = gql`
  query GetTickets($request: String) {
    tickets(req: $request) {
      id
      description
      assignedTo
      type
      status
      priority
      remindNotificationDate
      remindNotificationTime
    }
  }
`

export const CHANGE_DESCRIPTION = gql`
  mutation ChangeDescription($id : ID!, $newDescription: String) {
    changeTicketDescription(id: $id, newDescription: $newDescription) {
      id
      description
    }
  }
`
export const ASSIGN_TO = gql`
  mutation AssignTicketTo ($ticketId: ID!, $teamMemberId: ID!) {
    assignTicketToTeamMember(ticketId: $ticketId, teamMemberId: $teamMemberId) {
      id
      assignedTo
    }
  }
`

export const SET_REMINDER = gql`
  mutation SetReminderDate ($ticketId: ID!, $remindNotificationDate: LocalDate ) {
    setReminderDate (ticketId: $ticketId, remindNotificationDate: $remindNotificationDate) {
      id
      remindDateNotifcationDate
    }
  }
`