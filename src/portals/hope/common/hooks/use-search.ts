import gql from 'graphql-tag'
import {
  SearchQuery,
  SearchQueryVariables,
  useSearchLazyQuery,
} from 'types/generated/graphql'
import { useEffect, useState } from 'react'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'

gql`
  query Search($query: String!, $type: String!, $from: Int, $size: Int) {
    search(query: $query, type: $type, from: $from, size: $size) {
      highlights {
        field
        values
      }
      hit {
        ... on MemberSearchHit {
          memberId
          firstName
          lastName
        }
        ... on NoteSearchHit {
          memberId
          firstName
          lastName
          claimId
          text
          author
        }
      }
    }
  }
`

export interface UseSearchResult {
  hits: SearchQuery['search']
  loading: boolean
  search: (options?: SearchQueryOptions) => void
  fetchMore: (amount?: number, options?: SearchQueryOptions) => void
}

type SearchQueryOptions = Omit<SearchQueryVariables, 'query'>

export const useSearch = (
  query: string,
  baseOptions?: SearchQueryOptions,
): UseSearchResult => {
  const [result, setResult] = useState<SearchQuery['search']>([])
  const [search, { loading, refetch, data }] = useSearchLazyQuery()

  const getOptions = (options?: SearchQueryOptions): SearchQueryOptions => ({
    from: options?.from ?? baseOptions?.from,
    size: options?.size ?? baseOptions?.size,
    type: options?.type ?? baseOptions?.type ?? 'ALL',
  })

  useEffect(() => {
    if (data?.search) {
      PushUserAction(null, 'search', 'members', 'new')
      setResult(data.search)
    }
  }, [data])

  const searchHandler = (options?: SearchQueryOptions) => {
    if (result.length === 0) {
      // Lovely bug, need to refetch after first search
      search({
        variables: {
          query,
          ...getOptions(options),
        },
      })
      return
    }

    refetch({
      query,
      ...getOptions(options),
    })
  }

  const fetchMoreHandler = (amount?: number, options?: SearchQueryOptions) => {
    refetch({
      query,
      ...getOptions(options),
      size: result.length + (amount ?? 10),
    })
  }

  return {
    hits: result,
    loading,
    search: searchHandler,
    fetchMore: fetchMoreHandler,
  }
}
