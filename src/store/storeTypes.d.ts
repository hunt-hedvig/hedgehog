import { ClaimsStore } from './types/claimsTypes'
import { QuestionsStore } from './types/questionsTypes'

export interface BackofficeStore {
  login: any
  assets: any
  client: any
  poll: any
  messages: any
  members: MembersStore
  dashboard: any
  claims: ClaimsStore
  claimDetails: any
  questions: QuestionsStore
  insurance: any
  notifications: any
  memberInsurance: any
}

type MembersSortBy = 'NAME' | 'CREATED' | 'SIGN_UP'
type SortDirection = 'ASC' | 'DESC'
type MemberStatus =
  | 'INITIATED'
  | 'ONBOARDING'
  | 'SIGNED'
  | 'INACTIVATED'
  | 'TERMINATED'

export interface Member {
  memberId: number
  status: MemberStatus
  ssn: string
  firstName: string
  lastName: string
  street: string
  floor: number
  apartment: string
  city: string
  zipCode: string
  country: string
  email: string
  phoneNumber: string
  birthDate: string
  signedOn: string
  createdOn: string
}

export interface MemberSearchFilter {
  status: MemberStatus | undefined
  query: string
  sortBy: MembersSortBy
  sortDirection: SortDirection
  page: number
  pageSize: number
}

export interface MembersSearchResult {
  members: Member[]
  totalPages: number
  page: number
}

export interface MembersStore {
  list: Member[]
  searchResult: MembersSearchResult
  requesting: boolean
  searchFilter: MemberSearchFilter
}
