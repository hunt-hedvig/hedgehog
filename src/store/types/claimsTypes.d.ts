import { SortDirection } from '../storeTypes'

export interface Claim {
  id: string
  claimID: string
  date: string
  userId: string

  type: string
  state: string
  reserve: number
}

export interface ClaimSearchResult {
  claims: Claim[]
  page: number
  totalPages: number
}

type ClaimSortColumn = 'DATE' | 'TYPE' | 'STATE' | 'RESERVES'

export interface ClaimSearchFilter {
  page: number
  pageSize: number
  sortBy: ClaimSortColumn | undefined
  sortDirection: SortDirection
}

export interface ClaimsStore {
  searchFilter: ClaimSearchFilter
  searchResult: ClaimSearchResult
  requesting: boolean
  types: any[]
  memberClaims: Claim[]
}
