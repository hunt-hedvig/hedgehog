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

// This is hardcoded for now, since Hedgehog has no way of being aware of
// who is who and who is part of what team (?).
export const IEX_TEAM_MEMBERS = [
  { text: 'Matilda', value: 'matilda@hedvig.com' },
  { text: 'Karl', value: 'karl@hedvig.com' },
  { text: 'Johanna', value: 'johanna@hedvig.com' },
  { text: 'Tomas', value: 'tomas@hedvig.com' },
  { text: 'Kalle', value: 'karl.jernberg@hedvig.com' },
  { text: 'Emma', value: 'emma@hedvig.com' },
  { text: 'Sara', value: 'sara@hedvig.com' },
  { text: 'Axel', value: 'axel.bryhn@hedvig.com' },
  { text: 'Unassigned', value: 'Unassigned' },
]

// Purely for making it easier to read in the UI:
const IEX_TEAM_NAME_LOOKUP = {
  'matilda@hedvig.com': 'Matilda',
  'karl@hedvig.com': 'Karl',
  'johanna@hedvig.com': 'Johanna',
  'tomas@hedvig.com': 'Tomas',
  'karl.jernberg@hedvig.com': 'Kalle',
  'emma@hedvig.com': 'Emma',
  'sara@hedvig.com': 'Sara',
  'axel.bryhn@hedvig.com': 'Axel',
  Unassigned: 'Unassigned',
}

export const lookupTeamMemberName = (email: string): string => {
  name = IEX_TEAM_NAME_LOOKUP[email]
  if (name === '' || name === 'undefined') {
    return 'Unassigned'
  } else {
    return name
  }
}

export enum TicketStatus {
  RESOLVED = 'RESOLVED',
  WAITING = 'WAITING',
  WORKED_ON = 'WORKED_ON',
}

export const TICKET_STATUS = [
  { text: 'Waiting', value: TicketStatus.WAITING },
  { text: 'Is being handled', value: TicketStatus.WORKED_ON },
  { text: 'Completed', value: TicketStatus.RESOLVED },
]

export const lookupStatus = (statusValue: TicketStatus): string => {
  switch (statusValue) {
    case TicketStatus.RESOLVED:
      return 'Completed'
    case TicketStatus.WAITING:
      return 'Waiting'
    case TicketStatus.WORKED_ON:
      return 'Is being handled'
    default:
      return 'Unknown status'
  }
}

export enum TicketType {
  REMIND = 'REMIND',
  MESSAGE = 'MESSAGE',
  CLAIM = 'CLAIM',
  CALL_ME = 'CALL_ME',
  OTHER = 'CALL_ME',
}


