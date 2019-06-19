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

export const TICKET_PRIORITY_HIGH = 'HIGH'
export const TICKET_PRIORITY_MEDIUM = 'MEDIUM'
export const TICKET_PRIORITY_LOW = 'LOW'


// export enum TicketPriority {
// 	HIGH,
// 	MEDIUM,
// 	LOW,
// }


export const createOptionsArray = ( array ) => {
	let res = []
	array.map( element =>{ res.push({text : element, value: element})})
	return res 
} 