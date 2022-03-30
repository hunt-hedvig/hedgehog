import gql from 'graphql-tag'
import {
  SearchHit,
  SearchQueryVariables,
  SearchResultHighlight,
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
          id
          memberId
          firstName
          lastName
        }
        ... on NoteSearchHit {
          id
          memberId
          firstName
          lastName
          claimId
          text
          author
        }
        ... on QuoteSearchHit {
          id
          memberId
          ssn
          fullName
          street
          postalCode
          city
        }
        ... on QuoteCartSearchHit {
          id
          quotes {
            id
            memberId
            ssn
            fullName
            street
            postalCode
            city
          }
        }
      }
    }
  }
`

interface GenericSearchResult<T> {
  highlights: SearchResultHighlight[]
  hit: T
}

export interface UseSearchResult<T> {
  hits: GenericSearchResult<T>[]
  loading: boolean
  search: (options?: SearchQueryOptions) => void
  fetchMore: (amount?: number, options?: SearchQueryOptions) => void
}

type SearchQueryOptions = Omit<SearchQueryVariables, 'query'>

export const useSearch = <T extends SearchHit>(
  query: string,
  baseOptions?: SearchQueryOptions,
): UseSearchResult<T> => {
  const [result, setResult] = useState<GenericSearchResult<T>[]>([])
  const [search, { loading, refetch, data }] = useSearchLazyQuery({
    fetchPolicy: 'no-cache',
  })

  const getOptions = (options?: SearchQueryOptions): SearchQueryOptions => ({
    from: options?.from ?? baseOptions?.from,
    size: options?.size ?? baseOptions?.size,
    type: options?.type ?? baseOptions?.type ?? 'MEMBERS',
  })

  useEffect(() => {
    if (data?.search) {
      PushUserAction(baseOptions?.type ?? 'MEMBERS', 'search', null, 'new')
      setResult(data.search as GenericSearchResult<T>[])
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
