import gql from 'graphql-tag'

// Hacky solution to know who the user is: , returns the email.
export const ME = gql`
  query Me {
    me
  }
`
export const CREATE_TICKET = gql`
  mutation CreateTicket($ticket: TicketInput) {
    createTicket(ticket: $ticket) {
      description
      assignedTo
      type
      status
      priority
      remindNotificationDate
      remindNotificationTime
      remindMessage
    }
  }
`

export const GET_TICKETS = gql`
  query GetTickets {
    tickets {
      id
      description
      assignedTo
      createdBy
      type
      status
      priority
      remindNotificationDate
      remindNotificationTime
      remindMessage
    }
  }
`

export const CHANGE_DESCRIPTION = gql`
  mutation ChangeDescription($ticketId: ID!, $newDescription: String) {
    changeTicketDescription(
      ticketId: $ticketId
      newDescription: $newDescription
    ) {
      id
      description
    }
  }
`
export const ASSIGN_TO = gql`
  mutation AssignTicketTo($ticketId: ID!, $teamMemberId: ID!) {
    assignTicketToTeamMember(ticketId: $ticketId, teamMemberId: $teamMemberId) {
      id
      assignedTo
    }
  }
`
export const CHANGE_STATUS = gql`
  mutation ChangeTicketStatus($ticketId: ID!, $newStatus: TicketStatus) {
    changeTicketStatus(ticketId: $ticketId, newStatus: $newStatus) {
      id
      status
    }
  }
`

export const CHANGE_PRIORITY = gql`
  mutation ChangeTicketPriority($ticketId: ID!, $newPriority: Float) {
    changeTicketPriority(ticketId: $ticketId, newPriority: $newPriority) {
      id
      priority
    }
  }
`

export const CHANGE_REMINDER = gql`
  mutation ChangeTicketReminder(
    $ticketId: ID!
    $newReminder: RemindNotification
  ) {
    changeTicketReminder(ticketId: $ticketId, newReminder: $newReminder) {
      id
      remindNotificationDate
      remindNotificationTime
      remindMessage
    }
  }
`
