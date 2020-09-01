import { QuestionGroup } from 'api/generated/graphql'
import { Checkbox as StandardCheckbox } from 'hedvig-ui/checkbox'
import React from 'react'
import { Shield, ShieldShaded } from 'react-bootstrap-icons'
import styled from 'react-emotion'
import {
  doClaimFilter,
  doMarketFilter,
  doTeamFilter,
} from 'utils/questionGroup'

export enum FilterState {
  Even,
  Odd,
  Sweden,
  Norway,
  HasOpenClaim,
  NoOpenClaim,
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

const Label = styled.label`
  padding: 0.5rem 1rem 0.5rem 3rem !important;
  border-radius: 100px;
  transition: background 300ms;
  &:hover {
    background: ${({ theme }) => theme.accentBackground};
  }

  &:before,
  &:after {
    left: 1rem !important;
  }
  vertical-align: middle;
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
  background-color: ${({ theme }) => theme.danger};
`
const GreenTeamBadge = styled(TeamBadge)`
  background-color: ${({ theme }) => theme.success};
`

export const QuestionsFilter: React.FC<{
  questionGroups: ReadonlyArray<QuestionGroup>
  selected: ReadonlyArray<FilterState>
  onToggle: (filter: FilterState) => void
}> = ({ selected, onToggle, questionGroups }) => {
  const getCountByFilter = (filter: FilterState) => {
    switch (filter) {
      case FilterState.Even:
        return questionGroups.filter(doTeamFilter([filter])).length
      case FilterState.Odd:
        return questionGroups.filter(doTeamFilter([filter])).length
      case FilterState.Sweden:
        return questionGroups.filter(doMarketFilter([filter])).length
      case FilterState.Norway:
        return questionGroups.filter(doMarketFilter([filter])).length
      case FilterState.HasOpenClaim:
        return questionGroups.filter(doClaimFilter([filter])).length
      case FilterState.NoOpenClaim:
        return questionGroups.filter(doClaimFilter([filter])).length
    }
  }

  return (
    <>
      <Checkbox
        label={
          <Label>
            Red team ({getCountByFilter(FilterState.Even)})
            <RedTeamBadge />
          </Label>
        }
        checked={selected.includes(FilterState.Even)}
        onChange={() => onToggle(FilterState.Even)}
      />
      <Checkbox
        label={
          <Label>
            Green team ({getCountByFilter(FilterState.Odd)})
            <GreenTeamBadge />
          </Label>
        }
        checked={selected.includes(FilterState.Odd)}
        onChange={() => onToggle(FilterState.Odd)}
      />
      <Checkbox
        label={
          <Label>Sweden ({getCountByFilter(FilterState.Sweden)}) 🇸🇪</Label>
        }
        checked={selected.includes(FilterState.Sweden)}
        onChange={() => onToggle(FilterState.Sweden)}
      />
      <Checkbox
        label={
          <Label>Norway ({getCountByFilter(FilterState.Norway)}) 🇳🇴</Label>
        }
        checked={selected.includes(FilterState.Norway)}
        onChange={() => onToggle(FilterState.Norway)}
      />
      <Checkbox
        label={
          <Label>
            Has open claim️ ({getCountByFilter(FilterState.HasOpenClaim)}
            )
            <ShieldShaded style={{ marginLeft: '0.35rem' }} />
          </Label>
        }
        checked={selected.includes(FilterState.HasOpenClaim)}
        onChange={() => onToggle(FilterState.HasOpenClaim)}
      />
      <Checkbox
        label={
          <Label>
            No open claim ({getCountByFilter(FilterState.NoOpenClaim)}
            )
            <Shield style={{ marginLeft: '0.35rem' }} />
          </Label>
        }
        checked={selected.includes(FilterState.NoOpenClaim)}
        onChange={() => onToggle(FilterState.NoOpenClaim)}
      />
    </>
  )
}
