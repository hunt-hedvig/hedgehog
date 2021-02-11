import { QuestionGroup } from 'api/generated/graphql'
import { Checkbox as StandardCheckbox } from 'hedvig-ui/checkbox'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React, { useContext } from 'react'
import { Shield, ShieldShaded } from 'react-bootstrap-icons'
import styled from 'react-emotion'
import { NumberTeamsContext } from 'utils/number-teams-context'
import {
  doClaimFilter,
  doMarketFilter,
  doTeamFilter,
} from 'utils/questionGroup'

export const totalNumberOfColors = 6

export enum FilterState {
  Red,
  Green,
  Blue,
  Yellow,
  Teal,
  Purple,
  Sweden,
  Norway,
  Denmark,
  HasOpenClaim,
  NoOpenClaim,
}

const FilterRow = styled('div')`
  margin-bottom: 1rem;
`

const FilterLabel = styled(ThirdLevelHeadline)`
  width: 70px;
  display: inline-flex;
  font-weight: bold;
`

const FilterCheckbox = styled(StandardCheckbox)`
  width: 200px;
  &.ui.checkbox {
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

const FilterName = styled.label`
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

const TeamBadge = styled.div<{ filter: FilterState }>`
  background-color:
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  border-radius: 2px;
  vertical-align: center;
  margin-left: 0.5rem;
  background-color: ${({ filter }) => getFilterColor(filter)};
`

export const getFilterColor = (filter: number): string => {
  switch (filter) {
    case FilterState.Blue:
      return 'blue'
    case FilterState.Green:
      return 'green'
    case FilterState.Red:
      return 'red'
    case FilterState.Purple:
      return 'purple'
    case FilterState.Teal:
      return 'teal'
    case FilterState.Yellow:
      return 'yellow'
    default:
      return 'grey'
  }
}

export const QuestionsFilter: React.FC<{
  questionGroups: ReadonlyArray<QuestionGroup>
  selected: ReadonlyArray<FilterState>
  onToggle: (filter: FilterState) => void
}> = ({ selected, onToggle, questionGroups }) => {
  const getCountByFilter = (
    filter: FilterState,
    filterer: (
      selectedFilters: FilterState[],
    ) => (questionGroup: QuestionGroup) => boolean,
  ) => {
    return questionGroups.filter(filterer([filter])).length
  }

  const { numberTeams } = useContext(NumberTeamsContext)

  return (
    <>
      <FilterRow>
        <FilterLabel>Team: </FilterLabel>
        {[...Array(numberTeams)].map((_, filterNumber) => {
          return (
            <FilterCheckbox
              key={filterNumber}
              label={
                <FilterName>
                  {FilterState[filterNumber]} (
                  {getCountByFilter(filterNumber, doTeamFilter(numberTeams))}
                  )
                  <TeamBadge filter={filterNumber} />
                </FilterName>
              }
              checked={selected.includes(filterNumber)}
              onChange={() => onToggle(filterNumber)}
            />
          )
        })}
      </FilterRow>
      <FilterRow>
        <FilterLabel>Market: </FilterLabel>
        <FilterCheckbox
          label={
            <FilterName>
              Sweden ({getCountByFilter(FilterState.Sweden, doMarketFilter)}) 🇸🇪
            </FilterName>
          }
          checked={selected.includes(FilterState.Sweden)}
          onChange={() => onToggle(FilterState.Sweden)}
        />
        <FilterCheckbox
          label={
            <FilterName>
              Norway ({getCountByFilter(FilterState.Norway, doMarketFilter)}) 🇳🇴
            </FilterName>
          }
          checked={selected.includes(FilterState.Norway)}
          onChange={() => onToggle(FilterState.Norway)}
        />
        <FilterCheckbox
          label={
            <FilterName>
              Denmark ({getCountByFilter(FilterState.Denmark, doMarketFilter)})
              🇩🇰
            </FilterName>
          }
          checked={selected.includes(FilterState.Denmark)}
          onChange={() => onToggle(FilterState.Denmark)}
        />
      </FilterRow>
      <FilterRow>
        <FilterLabel>Claim: </FilterLabel>
        <FilterCheckbox
          label={
            <FilterName>
              Has open claim️ (
              {getCountByFilter(FilterState.HasOpenClaim, doClaimFilter)}
              )
              <ShieldShaded style={{ marginLeft: '0.35rem' }} />
            </FilterName>
          }
          checked={selected.includes(FilterState.HasOpenClaim)}
          onChange={() => onToggle(FilterState.HasOpenClaim)}
        />
        <FilterCheckbox
          label={
            <FilterName>
              No open claim (
              {getCountByFilter(FilterState.NoOpenClaim, doClaimFilter)}
              )
              <Shield style={{ marginLeft: '0.35rem' }} />
            </FilterName>
          }
          checked={selected.includes(FilterState.NoOpenClaim)}
          onChange={() => onToggle(FilterState.NoOpenClaim)}
        />
      </FilterRow>
    </>
  )
}
