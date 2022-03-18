import { Checkbox, FadeIn, Input, Shadowed } from '@hedvig-ui'
import {
  isPressing,
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
} from 'portals/hope/features/members-search/styles'
import React, { useRef, useState } from 'react'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'

interface SearchFieldProps {
  onSubmit: (query: string, includeAll: boolean) => void
  onFocus?: () => void
  loading: boolean
  query: string
  includeAll: boolean
  setQuery: (query: string) => void
  setIncludeAll: (includeAll: boolean) => void
  currentResultSize: number
  setLuckySearch: (luckySearch: boolean) => void
  membersLength: number
  suggestionsLength: number
}

const stagingToolsAvailable = () => {
  return (
    (
      window as Window &
        typeof global & { HOPE_FEATURES: { stagingSpecificTools?: boolean } }
    ).HOPE_FEATURES?.stagingSpecificTools ?? false
  )
}

export const SearchForm = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      onSubmit,
      onFocus,
      loading,
      query,
      setQuery,
      includeAll,
      setIncludeAll,
      currentResultSize,
      setLuckySearch,
    },
    forwardRef,
  ) => {
    const [textFieldFocused, setTextFieldFocused] = useState(false)
    const { isMetaKey, metaKey } = usePlatform()
    const { register } = useNavigation()

    const defaultRef = useRef<HTMLInputElement>(null)
    const ref = (forwardRef ?? defaultRef) as React.RefObject<HTMLInputElement>

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
              {...register('Member Search Form', {
                autoFocus: true,
                withFocus: true,
              })}
              onChange={({ target: { value } }) => {
                if (shouldIgnoreInput(value)) {
                  return
                }
                setQuery(value)
              }}
              icon={<SearchIcon muted={!query} />}
              placeholder="Looking for someone...?"
              // id="query"
              value={query}
              loading={loading}
              size="large"
              type="search"
              autoFocus
              muted={!query}
              ref={ref}
              onFocus={() => {
                setTextFieldFocused(true)
                if (onFocus) {
                  onFocus()
                }
              }}
              onBlur={() => setTextFieldFocused(false)}
              onKeyDown={(e) => {
                if (
                  isMetaKey(e) &&
                  isPressing(e, Keys.Enter) &&
                  (query || (stagingToolsAvailable() && !query))
                ) {
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
              setIncludeAll(e.currentTarget.checked)
              onSubmit(query, e.currentTarget.checked)
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
  },
)
