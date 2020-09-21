import {
  EscapeButton,
  Group,
  SearchButton,
  SearchIcon,
  SearchInput,
  SearchInputGroup,
} from 'components/members-search/styles'
import { Checkbox } from 'hedvig-ui/checkbox'
import React from 'react'

export const SearchForm: React.FC<{
  onSubmit: (query: string, includeAll: boolean) => void
  loading: boolean
  query: string
  includeAll: boolean
  setQuery: (query: string) => void
  setIncludeAll: (includeAll: boolean) => void
  currentResultSize: number
}> = ({
  onSubmit,
  loading,
  query,
  setQuery,
  includeAll,
  setIncludeAll,
  currentResultSize,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(query, includeAll)
      }}
    >
      <Group>
        <SearchInputGroup>
          <SearchIcon muted={!query} />
          <SearchInput
            onChange={(_, { value }) => setQuery(value)}
            placeholder="Looking for someone...?"
            id="query"
            value={query}
            loading={loading}
            size="big"
            type="search"
            autoFocus
            muted={!query}
          />
          <SearchButton
            type="submit"
            disabled={loading}
            variation="primary"
            size="large"
            visible={Boolean(query)}
          >
            Search
          </SearchButton>
        </SearchInputGroup>
      </Group>
      <Group pushLeft>
        <Checkbox
          onChange={(_, { checked }) => {
            setIncludeAll(checked!)
            onSubmit(query, checked!)
          }}
          checked={includeAll}
          label="Wide search"
        />

        <EscapeButton
          size="small"
          visible={!query && currentResultSize > 0}
          onClick={() => onSubmit('', false)}
        >
          Clear
        </EscapeButton>
      </Group>
    </form>
  )
}
