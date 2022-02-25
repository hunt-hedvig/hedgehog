import gql from 'graphql-tag'
import { SearchQuery, useSearchLazyQuery } from 'types/generated/graphql'
import { useDebounce } from 'portals/hope/common/hooks/use-debounce'
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
    }
  }
`

interface UseSearchOptions {
  from?: number
  size?: number
  debounce?: number
  minChars?: number
  type?: string
  manual?: boolean
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
  const [search, { loading, refetch, data }] = useSearchLazyQuery()

  useEffect(() => {
    if (data?.search) {
      setResult(data.search)
    }
  }, [data])

  const searchHandler = (options?: Omit<UseSearchOptions, 'debounce'>) => {
    if (result.length === 0) {
      // Lovely bug with cache, need to refetch after first search
      search({
        variables: {
          query,
          from: options?.from ?? baseOptions?.from,
          size: options?.size ?? baseOptions?.size,
          type: options?.type ?? baseOptions?.type ?? 'ALL',
        },
      })
      return
    }
    refetch({
      query,
      from: options?.from ?? baseOptions?.from,
      size: options?.size ?? baseOptions?.size,
      type: options?.type ?? baseOptions?.type ?? 'ALL',
    })
  }

  const fetchMoreHandler = () => {
    refetch({ query, from: result.length }).then(({ data }) => {
      console.log(data)
      if (!data) {
        return
      }

      setResult([...result, ...data.search])
    })
  }

  useEffect(() => {
    if (
      debouncedQuery.length >= (baseOptions?.minChars ?? 3) &&
      !baseOptions?.manual
    ) {
      search({
        variables: {
          query: debouncedQuery,
          from: baseOptions?.from,
          size: baseOptions?.size,
          type: baseOptions?.type ?? 'ALL',
        },
      }).then(({ data }) => {
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
