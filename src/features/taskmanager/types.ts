export interface IOption {
  text: string
  value: string
  key?: string
}

export const createOptionsArray = (array: IOption[]): IOption[] => {
  const res = []
  array.map((element) => {
    res.push({ text: element.text, value: element.value, key: element.value })
  })
  return res
}

export const IEX_TEAM_MEMBERS_OPTIONS = [
  { text: 'Unassigned', value: null },
  { text: 'Emma', value: 'emma@hedvig.com' },
  { text: 'Kalle', value: 'karl.jernberg@hedvig.com' },
  { text: 'Kajsa', value: 'kajsa@hedvig.com' },
  { text: 'Ludvig', value: 'ludvig@hedvig.com' },
  { text: 'Sara', value: 'sara@hedvig.com' },
  { text: 'Tomas', value: 'tomas@hedvig.com' },
  { text: 'Ella', value: 'ella@hedvig.com' },
  { text: 'Johanna', value: 'johanna@hedvig.com' },
  { text: 'Karl', value: 'karl@hedvig.com' },
  { text: 'Matilda', value: 'matilda@hedvig.com' },
  { text: 'Sebastian', value: 'sebastian@hedvig.com' },
  { text: 'Elvin', value: 'elvin@hedvig.com' },
]

// Purely for making it easier to read in the UI:
const IEX_TEAM_NAME_LOOKUP = IEX_TEAM_MEMBERS_OPTIONS.reduce(
  (acc, val) => {
    return { ...acc, [val.value]: val.text }
  },
  { [IEX_TEAM_MEMBERS_OPTIONS[0].value]: IEX_TEAM_MEMBERS_OPTIONS[0].text },
)

export const lookupTeamMemberName = (email: string): string => {
  return (name = IEX_TEAM_NAME_LOOKUP[email] || 'Unassigned')
}

export enum TicketStatus {
  WAITING = 'WAITING',
  WORKING_ON = 'WORKING_ON',
  RESOLVED = 'RESOLVED',
  ON_HOLD = 'ON_HOLD',
}

export const TICKET_STATUS = [
  { text: 'Waiting', value: TicketStatus.WAITING },
  { text: 'Working on', value: TicketStatus.WORKING_ON },
  { text: 'On hold', value: TicketStatus.ON_HOLD },
  { text: 'Resolved', value: TicketStatus.RESOLVED },
]

export const lookupStatus = (statusValue: TicketStatus): string => {
  switch (statusValue) {
    case TicketStatus.RESOLVED:
      return 'Resolved'
    case TicketStatus.WAITING:
      return 'Waiting'
    case TicketStatus.ON_HOLD:
      return 'On hold'
    case TicketStatus.WORKING_ON:
      return 'Working on'
    default:
      return 'Unknown status'
  }
}

export enum TicketType {
  REMIND = 'REMIND',
  MESSAGE = 'MESSAGE',
  CLAIM = 'CLAIM',
  CALL_ME = 'CALL_ME',
  OTHER = 'OTHER',
}

export enum TicketChangeType {
  TICKET_CREATED = 'TICKET_CREATED',
  CHANGED_REMINDER = 'CHANGED_REMINDER',
  CHANGED_ASSIGNED_TO = 'CHANGED_ASSIGNED_TO',
  CHANGED_DESCRIPTION = 'CHANGED_DESCRIPTION',
  CHANGED_STATUS = 'CHANGED_STATUS',
  CHANGED_PRIORITY = 'CHANGED_PRIORITY',
}

export const TICKET_TYPE_OPTIONS = [
  { text: 'Reminder', value: TicketType.REMIND },
  { text: 'Message', value: TicketType.MESSAGE },
  { text: 'Claim', value: TicketType.CLAIM },
  { text: 'Callback', value: TicketType.CALL_ME },
  { text: 'Other', value: TicketType.OTHER },
]
