import { Checkbox, FadeIn, Input, Shadowed } from '@hedvig-ui'
import {
  Keys,
  shouldIgnoreInput,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { usePlatform } from '@hedvig-ui/hooks/use-platform'
import {
  EscapeButton,
  Group,
  SearchIcon,
  SearchInputGroup,
  SearchTip,
} from 'features/members-search/styles'
import React, { useState } from 'react'

interface SearchFieldProps {
  onSubmit: (query: string, includeAll: boolean) => void
  onFocus?: () => void
  loading: boolean
  query: string
  includeAll: boolean
  setQuery: (query: string) => void
  setIncludeAll: (includeAll: boolean) => void
  currentResultSize: number
  searchFieldRef: React.RefObject<HTMLInputElement>
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
  const { isMetaKey, metaKey } = usePlatform()

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
          <Input
            style={{ borderRadius: '0.5rem' }}
            onChange={({ target: { value } }) => {
              if (shouldIgnoreInput(value)) {
                return
              }
              setQuery(value)
            }}
            icon={<SearchIcon muted={!query} />}
            placeholder="Looking for someone...?"
            id="query"
            value={query}
            loading={loading}
            size="large"
            type="search"
            autoFocus
            muted={!query}
            ref={searchFieldRef}
            onFocus={() => {
              setTextFieldFocused(true)
              if (onFocus) {
                onFocus()
              }
            }}
            onBlur={() => setTextFieldFocused(false)}
            onKeyDown={(e) => {
              if (isMetaKey(e) && e.keyCode === Keys.Enter.code && query) {
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
          onChange={(e) => {
            setIncludeAll(e.currentTarget.checked!)
            onSubmit(query, e.currentTarget.checked!)
          }}
          checked={includeAll}
          label="Wide search"
        />

        <EscapeButton
          size="small"
          visible={!query && currentResultSize > 0 ? 1 : 0}
          onClick={() => onSubmit('', false)}
        >
          Clear
        </EscapeButton>

        {textFieldFocused && (
          <FadeIn duration={200}>
            <SearchTip>
              Press <Shadowed>{metaKey.hint}</Shadowed> +{' '}
              <Shadowed>Enter</Shadowed> to use lucky search
            </SearchTip>
          </FadeIn>
        )}
      </Group>
    </form>
  )
}
