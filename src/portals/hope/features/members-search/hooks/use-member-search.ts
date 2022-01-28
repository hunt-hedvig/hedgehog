import gql from 'graphql-tag'
import {
  ExtensiveMemberSearchQuery,
  MemberSearchOptions,
  SlimMemberSearchQuery,
  useExtensiveMemberSearchLazyQuery,
  useSlimMemberSearchLazyQuery,
} from 'types/generated/graphql'
import { ApolloError } from '@apollo/client'
import { useState } from 'react'

gql`
  query SlimMemberSearch($query: String!, $options: MemberSearchOptions!) {
    memberSearch(query: $query, options: $options) {
      members {
        memberId
        firstName
        lastName
      }
      page
      totalPages
    }
  }

  query ExtensiveMemberSearch($query: String!, $options: MemberSearchOptions!) {
    memberSearch(query: $query, options: $options) {
      members {
        memberId
        firstName
        lastName
        status
        signedOn
        birthDate
        contractMarketInfo {
          market
        }
        contracts {
          status
          masterInception
          terminationDate
        }
      }
      page
      totalPages
    }
  }
`

export type UseMemberSearchMembers =
  | ExtensiveMemberSearchQuery['memberSearch']['members']
  | SlimMemberSearchQuery['memberSearch']['members']

interface UseMemberSearchResult {
  members: UseMemberSearchMembers
  page?: number
  totalPages?: number
  search: (query: string, options?: MemberSearchOptions) => void
  loading: boolean
  error?: ApolloError
}

const defaultOptions: MemberSearchOptions = {
  includeAll: false,
  page: 0,
  pageSize: 25,
  sortBy: 'SIGN_UP',
  sortDirection: 'DESC',
}

export const useMemberSearch = (slim = true): UseMemberSearchResult => {
  const [members, setMembers] = useState<UseMemberSearchResult['members']>([])
  const [extensiveMemberSearch, extensiveResponse] =
    useExtensiveMemberSearchLazyQuery()
  const [slimMemberSearch, slimResponse] = useSlimMemberSearchLazyQuery()

  const memberSearch = slim ? slimMemberSearch : extensiveMemberSearch
  const response = slim ? slimResponse : extensiveResponse

  const search = (query: string, options?: MemberSearchOptions) => {
    memberSearch({
      variables: {
        query,
        options: { ...defaultOptions, ...options },
      },
    }).then(({ data }) => setMembers(data?.memberSearch?.members ?? []))
  }

  const page = response?.data?.memberSearch?.page
  const totalPages = response?.data?.memberSearch?.totalPages

  const error = response.error
  const loading = response.loading

  return { members, page, totalPages, search, error, loading }
}
