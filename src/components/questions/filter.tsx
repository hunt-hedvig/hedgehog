import styled from '@emotion/styled'
import { Checkbox as StandardCheckbox, ThirdLevelHeadline } from '@hedvig-ui'
import { QuestionGroup } from 'api/generated/graphql'
import { lightTheme } from 'hedvig-ui/themes'
import React from 'react'
import { Shield, ShieldShaded } from 'react-bootstrap-icons'
import { range } from 'utils/array'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'
import {
  doClaimFilter,
  doMarketFilter,
  doMemberGroupFilter,
} from 'utils/questionGroup'

export const totalNumberMemberGroups = 3

export enum FilterState {
  First,
  Second,
  Third,
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

const ColorBadge = styled.div<{ filter: FilterState }>`
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  border-radius: 2px;
  vertical-align: center;
  margin-left: 0.5rem;
  background-color: ${({ filter }) => getFilterColor(filter)};
`

export const getFilterColor = (filter: FilterState): string => {
  switch (filter) {
    case FilterState.First:
      return lightTheme.danger
    case FilterState.Second:
      return lightTheme.success
    case FilterState.Third:
      return lightTheme.highlight
    default:
      return lightTheme.accent
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

  const { numberMemberGroups } = useNumberMemberGroups()

  return (
    <>
      <FilterRow>
        <FilterLabel>Group: </FilterLabel>
        {range(numberMemberGroups).map((filterNumber) => {
          return (
            <FilterCheckbox
              key={filterNumber}
              label={
                <FilterName>
                  {FilterState[filterNumber]} (
                  {getCountByFilter(
                    filterNumber,
                    doMemberGroupFilter(numberMemberGroups),
                  )}
                  )
                  <ColorBadge filter={filterNumber} />
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
