import { Button } from 'hedvig-ui/button'
import * as React from 'react'
import styled from 'react-emotion'

const FilterWrapper = styled('div')({
  display: 'flex',
  paddingBottom: '1rem',
})

export enum FilterState {
  Even,
  Odd,
}

export const QuestionsFilter: React.FC<{
  selected: ReadonlyArray<FilterState>
  onToggle: (filter: FilterState) => void
}> = ({ selected, onToggle }) => {
  return (
    <FilterWrapper>
      <Button
        onClick={() => {
          onToggle(FilterState.Even)
        }}
        basic={!selected.includes(FilterState.Even)}
        variation="secondary"
        type="button"
      >
        The empire
      </Button>
      <Button
        onClick={() => {
          onToggle(FilterState.Odd)
        }}
        basic={!selected.includes(FilterState.Odd)}
        variation="success"
        type="button"
      >
        The resistance
      </Button>
    </FilterWrapper>
  )
}
