export interface BackofficeStore {
  login: any
  assets: any
  client: any
  poll: any
  messages: any
  members: any
  dashboard: any
  claims: any
  claimDetails: any
  questions: any
  insurance: any
  notifications: any
  memberInsurance: any
}


export interface MembersStore {
  list: any[]
  requesting: boolean
  filter: string
}
