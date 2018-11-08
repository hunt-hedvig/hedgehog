import { SortDirection } from '../storeTypes'

export type SafetyIncreaserType =
  | 'SMOKE_ALARM'
  | 'FIRE_EXTINGUISHER'
  | 'SAFETY_DOOR'
  | 'GATE'
  | 'BURGLAR_ALARM'
  | 'NONE'

export type ProductState = 'QUOTE' | 'SIGNED' | 'TERMINATED'

export interface MemberInsurance {
  productId: string
  memberId: string
  memberFirstName: string
  memberLastName: string
  street: string
  city: string
  zipCode: string
  floor: string
  livingSpace: number
  safetyIncreasers: SafetyIncreaserType[]
  insuranceStatus: string
  insuranceState: ProductState
  personsInHouseHold: number
  currentTotalPrice: number
  newTotalPrice: number
  insuredAtOtherCompany: boolean
  insuranceType: string
  insuranceActiveFrom: string
  insuranceActiveTo: string
  certificateUploaded: boolean
  certificateUrl: string
  cancellationEmailSent: boolean
  signedOn: string
}

export type ProductSortColumns =
  | 'MEMBER_FULL_NAME'
  | 'TYPE'
  | 'CONTRACT_SIGNED_DATE'
  | 'ACTIVE_FROM_DATE'
  | 'ACTIVE_TO_DATE'
  | 'STATUS'
  | 'CANCELLATION_EMAIL_SENT_DATE'
  | 'CERTIFICATE_UPLOADED'
  | 'HOUSEHOLD_SIZE'

export interface MemberInsuranceSearchRequest {
  state: ProductState | undefined
  query: string
  page: number
  pageSize: number
  sortBy: ProductSortColumns
  sortDirection: SortDirection
}

export interface MemberInsuranceSearchResult {
  products: MemberInsurance[]
  page: number
  totalPages: number
}

export interface MemberInsuranceStore {
  searchFilter: MemberInsuranceSearchRequest
  searchResult: MemberInsuranceSearchResult
  requesting: boolean
}
