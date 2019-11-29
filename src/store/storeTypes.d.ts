import { ClaimsStore } from './types/claimsTypes'
import { MemberInsuranceStore } from './types/memberInsuranceTypes'
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
  payoutDetails: any
  questions: QuestionsStore
  insurance: any
  notifications: any
  memberInsurance: MemberInsuranceStore
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
  fraudulentStatus: string
  fraudulentDescription: string
}

export interface MemberSearchFilter {
  includeAll?: boolean
  query: string
  sortBy: MembersSortBy
  sortDirection: SortDirection
  page: number
  pageSize: number
}

export interface MemberSearchResultItem {
  member: Member
  firstActiveFrom: string | null
  lastActiveTo: string | null
  productStatus: string | null
}

export interface MembersSearchResult {
  items: ReadonlyArray<MemberSearchResultItem>
  totalPages: number
  page: number
}

export interface MembersStore {
  list: Member[]
  searchResult: MembersSearchResult
  requesting: boolean
  searchFilter: MemberSearchFilter
}
