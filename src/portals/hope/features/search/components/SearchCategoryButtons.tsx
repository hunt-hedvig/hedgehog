import React from 'react'
import styled from '@emotion/styled'
import { convertEnumOrSentenceToTitle } from '@hedvig-ui/utils/text'

const SearchCategoryButton = styled.button<{ selected?: boolean }>`
  border: none;
  background-color: ${({ theme, selected }) =>
    selected ? theme.accent : theme.accentLighter};
  transition: background-color 200ms;

  :hover {
    background-color: ${({ theme, selected }) =>
      selected ? theme.accent : theme.accentLight};
  }

  color: ${({ theme, selected }) =>
    selected ? theme.accentContrast : theme.accent};
  font-size: 1rem;
  padding: 0.25rem 0.65rem;
  border-radius: 1rem;
  cursor: pointer;
`

const searchCategories = [
  'members',
  // TODO: 'quotes'
] as const
export type SearchCategory = typeof searchCategories[number]

export const SearchCategoryButtons: React.FC<{
  category: SearchCategory
  onChange: (category: SearchCategory) => void
}> = ({ category, onChange }) => {
  return (
    <div>
      {searchCategories.map((searchCategory, index) => (
        <SearchCategoryButton
          key={searchCategory}
          onClick={() => onChange(searchCategory)}
          selected={category === searchCategory}
          style={{ marginLeft: index ? '1rem' : '0rem' }}
        >
          {convertEnumOrSentenceToTitle(searchCategory)}
        </SearchCategoryButton>
      ))}
    </div>
  )
}
