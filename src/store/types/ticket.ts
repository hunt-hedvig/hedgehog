export interface ITicket {
    ticketId: string,
    issuedBy: string,
    assignedTo: string,
   type: string,
    remind: RemindInfo, 
    priority: number,
    description: string,
}
//TODO: Add tags

export type RemindInfo = {
    date: string,
    time: string, 
}