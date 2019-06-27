
//This is hardcoded for now, since Hedgehog has no way of being aware of 
// who is who and who is part of what team. 
export const IEX_TEAM_MEMBERS = [
	'Matilda',
	'Karl',
	'Johanna',
	'Tomas',
	'Kalle',
	'Emma',
	'Sara',
	'Axel',
	'Unassigned',
] 

export const TICKET_STATUS = [
	'WAITING',
	'WORKED_ON',
	'RESOLVED',
]


export const TICKET_PRIORITY_HIGH = 'HIGH'
export const TICKET_PRIORITY_MEDIUM = 'MEDIUM'
export const TICKET_PRIORITY_LOW = 'LOW'

export const LOW_PRIORITY = 0
export const MEDIUM_PRIORITY = 1
export const HIGH_PRIORITY = 2

export const TYPE_CHATMSG = 'Chat message'
export const TYPE_REMIND = 'Remind'
export const TYPE_CLAIM = 'Claim'


export enum TicketPriority {
	HIGH,
	MEDIUM,
	LOW,
}

export const createOptionsArray = ( array ) => {
	let res = []
	array.map( element =>{ res.push({text : element, value: element, key: element})})
	return res 
} 