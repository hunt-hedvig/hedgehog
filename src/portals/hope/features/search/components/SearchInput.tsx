import styled from '@emotion/styled'
import { Input, lightTheme, useNavigation } from '@hedvig-ui'
import { isPressing, Keys } from '@hedvig-ui'
import chroma from 'chroma-js'
import { SearchIcon } from 'portals/hope/features/members-search/styles'
import React, { useState } from 'react'

const SuggestionText = styled.div`
  position: relative;
  top: -2.9rem;
  left: 3rem;
  font-size: 18px;
  opacity: 0.25;
  pointer-events: none;
`

const inputStyles: React.CSSProperties = {
  maxWidth: '50rem',
  width: '100%',
}

export const SearchInput: React.FC<{
  onChange: (query: string) => void
  onSearch: (query: string) => void
  loading?: boolean
  suggestion?: string
  defaultValue?: string
}> = ({ onSearch, onChange, loading, suggestion = '', defaultValue = '' }) => {
  const [value, setValue] = useState(defaultValue)
  const { register } = useNavigation()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSearch(value)
      }}
    >
      <div>
        <Input
          {...register(
            'Member Search Form',
            {
              autoFocus: true,
              withFocus: true,
              neighbors: {
                down: 'MembersList - Table Row 0',
              },
            },
            {
              ...inputStyles,
              border: `1px solid ${chroma(lightTheme.accent)
                .brighten(1)
                .hex()}`,
            },
            {
              ...inputStyles,
              border: '1px solid transparent',
            },
          )}
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
      </div>
    </form>
  )
}
