import { ArrayElement } from '@hedvig-ui/utils/array-element'
import {
  useSearch,
  UseSearchResult,
} from 'portals/hope/common/hooks/use-search'
import { useEffect } from 'react'

interface UseNameAutocompleteResult {
  suggestion: ArrayElement<UseSearchResult['hits']> | null
  suggestionString: string
}

export const useNameAutoComplete = (
  query: string,
): UseNameAutocompleteResult => {
  const { hits, search } = useSearch(query, {
    type: 'FULL_NAME',
  })

  useEffect(() => search(), [query])

  const suggestion =
    hits.find((hit) =>
      `${hit.firstName} ${hit.lastName}`
        .toLowerCase()
        .startsWith(query.toLowerCase()),
    ) ?? null

  const suggestionString = () => {
    if (!query) return ''
    if (!suggestion?.firstName || !suggestion?.lastName) return ''

    const completeString = `${suggestion.firstName} ${suggestion.lastName}`

    return query + completeString.substring(query.length)
  }

  return { suggestion, suggestionString: suggestionString() }
}
