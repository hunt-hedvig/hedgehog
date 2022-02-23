import { Page } from 'portals/hope/pages/routes'
import { Input } from '@hedvig-ui'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { SearchIcon } from 'portals/hope/features/members-search/styles'
import gql from 'graphql-tag'
import { useSearchLazyQuery } from 'types/generated/graphql'
import { useDebounce } from 'portals/hope/common/hooks/use-debounce'

const SearchInput = styled(Input)`
  max-width: 50rem;
  width: 100%;
`

gql`
  query Search($query: String!) {
    search(query: $query) {
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

const SearchPage: Page = () => {
  const [query, setQuery] = useState('')
  const [search, { data, loading }] = useSearchLazyQuery({
    variables: { query },
  })

  const debouncedQuery = useDebounce(query)

  console.log(data)

  useEffect(() => {
    if (debouncedQuery.length >= 3 && !loading) {
      search({ variables: { query: debouncedQuery } })
    }
  }, [debouncedQuery])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        search({ variables: { query } })
      }}
    >
      <SearchInput
        onChange={(e) => setQuery(e.currentTarget.value)}
        value={query}
        size="large"
        muted={!query}
        placeholder="What are you looking for?"
        icon={<SearchIcon muted={!query} />}
        loading={loading}
      />
    </form>
  )
}

export default SearchPage
