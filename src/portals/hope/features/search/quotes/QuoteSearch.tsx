import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useSearch } from 'portals/hope/common/hooks/use-search'
import { SearchInput } from 'portals/hope/features/search/components/SearchInput'
import { SearchCategoryButtons } from 'portals/hope/features/search/components/SearchCategoryButtons'
import { Button, Flex, Spacing, StandaloneMessage } from '@hedvig-ui'
import {
  ExtraInstruction,
  Instructions,
} from 'portals/hope/features/search/components/Instructions'
import { QuoteResult } from 'portals/hope/features/search/quotes/components/QuoteResult'
import { QuoteSearchHit } from 'types/generated/graphql'

export const QuoteSearch: React.FC<{ query: string | null }> = ({
  query: defaultQuery,
}) => {
  const history = useHistory()
  const [query, setQuery] = useState(defaultQuery ?? '')
  const [hasSearched, setHasSearched] = useState(false)
  const { hits, loading, search, fetchMore } = useSearch<QuoteSearchHit>(
    query,
    {
      type: 'QUOTES',
    },
  )

  useEffect(() => {
    setHasSearched(false)
  }, [query])

  useEffect(() => {
    if (query !== '') search()
  }, [defaultQuery])

  return (
    <>
      <SearchInput
        onChange={(value) => setQuery(value)}
        onSearch={() => {
          history.push(`/search/quotes?query=${query}`)
          setHasSearched(true)
        }}
        loading={loading}
        defaultValue={defaultQuery ?? ''}
      />

      <SearchCategoryButtons
        category="quotes"
        onChange={(category) =>
          history.push(`/search/${category}?query=${query}`)
        }
      />

      <Spacing top="large" />
      {hits.length !== 0 &&
        hits.map(({ hit }, index) => (
          <QuoteResult
            key={((hit as QuoteSearchHit)?.id ?? '') + index}
            quote={hit as QuoteSearchHit}
          />
        ))}

      {hits.length === 0 && query && hasSearched && (
        <StandaloneMessage>No results</StandaloneMessage>
      )}

      {hits.length !== 0 && hits.length >= 10 && (
        <Flex justify="center">
          <Button
            disabled={loading}
            variant="tertiary"
            onClick={() => fetchMore()}
          >
            Show more
          </Button>
        </Flex>
      )}
      {hits.length === 0 && !query && (
        <div>
          <Instructions>
            <h1>Search for quotes</h1>
            <div>
              Search for things related to a quote, such as
              <br />
              <code>name</code>, <code>street</code>, <code>SSN</code>,{' '}
              <code>postal code</code>, <code>city</code>
            </div>
            {query && (
              <ExtraInstruction>Press enter to search</ExtraInstruction>
            )}
          </Instructions>
        </div>
      )}
    </>
  )
}
