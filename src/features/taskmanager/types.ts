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
  // TODO: REMOVE THIS:::
  { text: 'Fabian', value: 'fabian@hedvig.com' },
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
  // TODO: REMOVE THIS::::
  'fabian@hedvig.com': 'Fabian',
}

export const TICKET_STATUS = [
  { text: 'Waiting', value: 'WAITING' },
  { text: 'Is being handled', value: 'WORKED_ON' },
  { text: 'Completed', value: 'RESOLVED' },
]

const TICKET_STATUS_LOOKUP = {
  WAITING: 'Waiting',
  WORKED_ON: 'Is being handled',
  RESOLVED: 'Completed',
}

export const TICKET_PRIORITY_HIGH = 'HIGH'
export const TICKET_PRIORITY_MEDIUM = 'MEDIUM'
export const TICKET_PRIORITY_LOW = 'LOW'

export const LOW_PRIORITY = 0
export const MEDIUM_PRIORITY = 1
export const HIGH_PRIORITY = 2

export const TYPE_CHATMSG = 'Chat message'
export const TYPE_REMIND = 'Remind'
export const TYPE_CLAIM = 'Claim'

export const lookupTeamMemberName = (email: string): string => {
  name = IEX_TEAM_NAME_LOOKUP[email]
  if (name === '' || name === 'undefined') {
    return 'Unassigned'
  } else {
    return name
  }
}

export const lookupStatus = (statusValue: string): string => {
  let statusText = TICKET_STATUS_LOOKUP[statusValue]
  if (statusText === '' || statusText === 'undefined') {
    statusText = 'Unknown status'
  }
  return statusText
}

export enum TicketPriority {
  HIGH,
  MEDIUM,
  LOW,
}

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
