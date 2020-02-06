import { AuthState } from 'store/actions/auth'
import { ClaimsStore } from './types/claimsTypes'
import { QuestionsStore } from './types/questionsTypes'

export interface BackofficeStore {
  auth: {
    state: AuthState
    scopes: ReadonlyArray<string>
    id?: string
    email?: string
  }
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
}

type MembersSortBy = 'NAME' | 'CREATED' | 'SIGN_UP'
type SortDirection = 'ASC' | 'DESC'
type MemberStatus =
  | 'INITIATED'
  | 'ONBOARDING'
  | 'SIGNED'
  | 'INACTIVATED'
  | 'TERMINATED'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

export interface Member {
  memberId: number
  status: MemberStatus
  ssn: string
  gender: Gender
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
  householdSize: number | null
  livingSpace: number | null
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
