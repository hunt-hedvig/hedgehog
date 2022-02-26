import gql from 'graphql-tag'
import {
  SearchQuery,
  SearchQueryVariables,
  useSearchLazyQuery,
} from 'types/generated/graphql'
import { useEffect, useState } from 'react'

gql`
  query Search($query: String!, $from: Int, $size: Int, $type: String) {
    search(query: $query, from: $from, size: $size, type: $type) {
      memberId
      firstName
      lastName
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
  fetchMore: () => void
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
    type: options?.type ?? baseOptions?.type,
  })

  useEffect(() => {
    if (data?.search) {
      setResult(data.search)
    }
  }, [data])

  const searchHandler = (options?: SearchQueryOptions) => {
    if (result.length === 0) {
      // Lovely bug with cache, need to refetch after first search
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

  const fetchMoreHandler = () => {
    refetch({ query, size: result.length + 10 })
  }

  return {
    hits: result,
    loading,
    search: searchHandler,
    fetchMore: fetchMoreHandler,
  }
}
