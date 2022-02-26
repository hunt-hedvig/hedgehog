import React, { useEffect, useState } from 'react'
import { SearchIcon } from 'portals/hope/features/members-search/styles'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { ArrayElement } from '@hedvig-ui/utils/array-element'
import {
  useSearch,
  UseSearchResult,
} from 'portals/hope/common/hooks/use-search'
import styled from '@emotion/styled'
import { Input } from '@hedvig-ui'

const StyledInput = styled(Input)`
  max-width: 50rem;
  width: 100%;
`

const SuggestionText = styled.div`
  position: relative;
  top: -2.86rem;
  left: 2.91rem;
  font-size: 18px;
  opacity: 0.25;
  pointer-events: none;
  margin-bottom: -2.86rem;
`

const useAutoComplete = (
  query: string,
): ArrayElement<UseSearchResult['hits']> | null => {
  const { hits, search } = useSearch(query, {
    type: 'FULL_NAME',
  })

  useEffect(() => search(), [query])

  return (
    hits.find((hit) =>
      `${hit.firstName} ${hit.lastName}`
        .toLowerCase()
        .startsWith(query.toLowerCase()),
    ) ?? null
  )
}

export const SearchInput: React.FC<{
  onSearch: (query: string) => void
  loading?: boolean
}> = ({ onSearch, loading }) => {
  const [value, setValue] = useState('')
  const suggestion = useAutoComplete(value)

  const suggestionString = () => {
    if (!value) return ''
    if (!suggestion?.firstName || !suggestion?.lastName) return ''

    const completeString = `${suggestion.firstName} ${suggestion.lastName}`

    return value + completeString.substring(value.length)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSearch(value)
      }}
    >
      <div>
        <StyledInput
          onChange={(e) => {
            setValue(e.currentTarget.value)
          }}
          value={value}
          size="large"
          muted={!value}
          placeholder="What are you looking for?"
          icon={<SearchIcon muted={!value} />}
          loading={loading}
          autoFocus
          onKeyDown={(e) => {
            if (
              isPressing(e, Keys.Right) &&
              suggestionString() &&
              suggestionString() !== value
            ) {
              setValue(suggestionString)
            }
          }}
        />

        <SuggestionText>{suggestionString() || '\u00a0'}</SuggestionText>
      </div>{' '}
    </form>
  )
}
