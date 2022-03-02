import React, { useState } from 'react'
import { SearchIcon } from 'portals/hope/features/members-search/styles'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
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

export const SearchInput: React.FC<{
  onChange: (query: string) => void
  onSearch: (query: string) => void
  loading?: boolean
  suggestion?: string
}> = ({ onSearch, onChange, loading, suggestion = '' }) => {
  const [value, setValue] = useState('')

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
            onChange(e.currentTarget.value)
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
              suggestion &&
              suggestion !== value
            ) {
              setValue(suggestion)
            }
          }}
        />

        <SuggestionText>{suggestion || '\u00a0'}</SuggestionText>
      </div>{' '}
    </form>
  )
}
