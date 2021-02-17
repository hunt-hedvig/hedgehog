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
import {
  isAllowedOptionKeyCode,
  KeyCode,
  useKeyIsPressed,
  usePressedKey,
} from 'utils/hooks/key-press-hook'

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
}) => {
  const pressedKey = usePressedKey()
  const optionIsPressed = useKeyIsPressed(KeyCode.Option)
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
              if (optionIsPressed && !isAllowedOptionKeyCode(pressedKey)) {
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
            onFocus={onFocus}
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
