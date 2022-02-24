import gql from 'graphql-tag'
import { SearchQuery, useSearchLazyQuery } from 'types/generated/graphql'
import { useDebounce } from 'portals/hope/common/hooks/use-debounce'
import { useEffect, useState } from 'react'

gql`
  query Search($query: String!, $from: Int, $size: Int) {
    search(query: $query, from: $from, size: $size) {
      memberId
      firstName
      lastName
      highlights {
        field
        values
      }
    }
  }
`

interface UseSearchOptions {
  from?: number
  size?: number
  debounce?: number
}

interface UseSearchResult {
  hits: SearchQuery['search']
  loading: boolean
  search: (options?: Omit<UseSearchOptions, 'debounce'>) => void
  fetchMore: () => void
}

export const useSearch = (
  query: string,
  baseOptions?: UseSearchOptions,
): UseSearchResult => {
  const debouncedQuery = useDebounce(query, baseOptions?.debounce ?? 200)
  const [result, setResult] = useState<SearchQuery['search']>([])
  const [search, { loading }] = useSearchLazyQuery({
    variables: { query: debouncedQuery },
  })

  const searchHandler = (options?: Omit<UseSearchOptions, 'debounce'>) => {
    search({
      variables: {
        query: debouncedQuery,
        from: options?.from ?? baseOptions?.from,
        size: options?.size ?? baseOptions?.size,
      },
    }).then(({ data }) => {
      if (!data) {
        return
      }

      setResult(data.search)
    })
  }

  const fetchMoreHandler = () => {
    search({
      variables: { query: debouncedQuery, from: result.length },
    }).then(({ data }) => {
      if (!data) {
        return
      }

      setResult([...result, ...data.search])
    })
  }

  useEffect(() => {
    if (debouncedQuery.length >= 3 && !loading) {
      search({ variables: { query: debouncedQuery } }).then(({ data }) => {
        if (!data) {
          return
        }

        setResult(data.search)
      })
    }
  }, [debouncedQuery])

  return {
    hits: result,
    loading,
    search: searchHandler,
    fetchMore: fetchMoreHandler,
  }
}
