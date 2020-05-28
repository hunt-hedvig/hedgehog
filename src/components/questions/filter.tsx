import { Checkbox as StandardCheckbox } from 'hedvig-ui/checkbox'
import React from 'react'
import styled from 'react-emotion'

export enum FilterState {
  Even,
  Odd,
}

const Checkbox = styled(StandardCheckbox)`
  &.ui.checkbox {
    padding-right: 3rem;

    label {
      display: inline-flex;
      align-items: center;

      &:before,
      &:after {
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
`

const TeamBadge = styled.div`
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  border-radius: 2px;
  vertical-align: center;
  margin-left: 0.5rem;
`

const RedTeamBadge = styled(TeamBadge)`
  background-color: #e24646;
`
const GreenTeamBadge = styled(TeamBadge)`
  background-color: #1cb09b;
`

export const QuestionsFilter: React.FC<{
  selected: ReadonlyArray<FilterState>
  onToggle: (filter: FilterState) => void
}> = ({ selected, onToggle }) => {
  return (
    <>
      <Checkbox
        label={
          <label>
            Red team
            <RedTeamBadge />
          </label>
        }
        checked={selected.includes(FilterState.Even)}
        onChange={() => onToggle(FilterState.Even)}
      />
      <Checkbox
        label={
          <label>
            Green team
            <GreenTeamBadge />
          </label>
        }
        checked={selected.includes(FilterState.Odd)}
        onChange={() => onToggle(FilterState.Odd)}
      />
    </>
  )
}
