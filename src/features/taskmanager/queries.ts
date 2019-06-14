import gql from 'graphql-tag'


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
    setReminderDate (ticketId: $ticketId, remindNotificationDate: $rremindNotificationDate) {
      id
      remindDateNotifcationDate
    }
  }
`