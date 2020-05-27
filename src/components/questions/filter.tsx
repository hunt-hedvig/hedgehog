import { Button, ButtonsGroup } from 'hedvig-ui/button'
import React from 'react'

export enum FilterState {
  Even,
  Odd,
}

export const QuestionsFilter: React.FC<{
  selected: ReadonlyArray<FilterState>
  onToggle: (filter: FilterState) => void
}> = ({ selected, onToggle }) => {
  return (
    <ButtonsGroup>
      <Button
        fullWidth
        onClick={() => {
          onToggle(FilterState.Even)
        }}
        basic={!selected.includes(FilterState.Even)}
        variation="danger"
        type="button"
      >
        The Empire
      </Button>

      <Button
        fullWidth
        onClick={() => {
          onToggle(FilterState.Odd)
        }}
        basic={!selected.includes(FilterState.Odd)}
        variation="success"
        type="button"
      >
        The Resistance
      </Button>
    </ButtonsGroup>
  )
}
