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
import { QuoteCartSearchHit } from 'types/generated/graphql'
import { QuoteCartResult } from 'portals/hope/features/search/carts/components/QuoteCartResult'

export const QuoteCartSearch: React.FC<{ query: string | null }> = ({
  query: defaultQuery,
}) => {
  const history = useHistory()
  const [query, setQuery] = useState(defaultQuery ?? '')
  const [hasSearched, setHasSearched] = useState(false)
  const { hits, loading, search, fetchMore } = useSearch<QuoteCartSearchHit>(
    query,
    {
      type: 'QUOTE_CARTS',
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
          history.push(`/search/carts?query=${query}`)
          setHasSearched(true)
        }}
        loading={loading}
        defaultValue={defaultQuery ?? ''}
      />

      <SearchCategoryButtons
        category="carts"
        onChange={(category) =>
          history.push(`/search/${category}?query=${query}`)
        }
      />

      <Spacing top="large" />
      {hits.length !== 0 &&
        hits.map(({ hit }) => <QuoteCartResult key={hit.id} quoteCart={hit} />)}

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
            <h1>Search for quote carts</h1>
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
