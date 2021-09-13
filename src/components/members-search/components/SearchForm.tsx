import { Checkbox, FadeIn, Shadowed } from '@hedvig-ui'
import {
  EscapeButton,
  Group,
  SearchIcon,
  SearchInput,
  SearchInputGroup,
  SearchTip,
} from 'components/members-search/styles'
import React, { useState } from 'react'
import { Keys, shouldIgnoreInput } from 'utils/hooks/key-press-hook'

interface SearchFieldProps {
  onSubmit: (query: string, includeAll: boolean) => void
  onFocus: () => void
  loading: boolean
  query: string
  includeAll: boolean
  setQuery: (query: string) => void
  setIncludeAll: (includeAll: boolean) => void
  currentResultSize: number
  searchFieldRef: React.Ref<any>
  setLuckySearch: (luckySearch: boolean) => void
}

export const SearchForm: React.FC<SearchFieldProps> = ({
  onSubmit,
  onFocus,
  loading,
  query,
  setQuery,
  includeAll,
  setIncludeAll,
  currentResultSize,
  searchFieldRef,
  setLuckySearch,
}) => {
  const [textFieldFocused, setTextFieldFocused] = useState(false)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(query, includeAll)
      }}
      autoComplete="off"
    >
      <Group>
        <SearchInputGroup>
          <SearchIcon muted={!query} />
          <SearchInput
            onChange={(_, { value }) => {
              if (shouldIgnoreInput(value)) {
                return
              }
              setQuery(value)
            }}
            placeholder="Looking for someone...?"
            id="query"
            value={query}
            loading={loading}
            size="big"
            type="search"
            autoFocus
            muted={!query}
            ref={searchFieldRef}
            onFocus={() => {
              setTextFieldFocused(true)
              onFocus()
            }}
            onBlur={() => setTextFieldFocused(false)}
            onKeyPress={(e) => {
              if (e.altKey && e.charCode === Keys.Enter.code && query) {
                setLuckySearch(true)
                onSubmit(query, includeAll)
              } else {
                setLuckySearch(false)
              }
            }}
          />
        </SearchInputGroup>
      </Group>
      <Group pushLeft style={{ display: 'flex', alignItems: 'center' }}>
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

        {textFieldFocused && (
          <FadeIn duration={200}>
            <SearchTip>
              Press <Shadowed>Option</Shadowed> + <Shadowed>Enter</Shadowed> to
              use lucky search
            </SearchTip>
          </FadeIn>
        )}
      </Group>
    </form>
  )
}
