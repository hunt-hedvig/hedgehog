import styled from '@emotion/styled'
import { Checkbox, lightTheme, ThirdLevelHeadline } from '@hedvig-ui'
import { range } from '@hedvig-ui/utils/range'
import {
  doClaimFilter,
  doMarketFilter,
  doMemberGroupFilter,
} from 'features/questions/utils'
import React from 'react'
import { Shield, ShieldShaded } from 'react-bootstrap-icons'
import { QuestionGroup } from 'types/generated/graphql'
import { useNumberMemberGroups } from 'utils/use-number-member-groups'

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
  display: grid;
  align-items: flex-start;
  grid-template-columns: 100px 200px 200px 200px;
  column-gap: 20px;
  margin-bottom: 1rem;
`

const FilterLabel = styled(ThirdLevelHeadline)`
  width: 70px;
  display: inline-flex;
  font-weight: bold;
`

const FilterName = styled.span`
  display: flex;
  align-items: center;
`

export const ColorBadge = styled.div<{ filter?: FilterState }>`
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  border-radius: 2px;
  vertical-align: center;
  margin-left: 0.5rem;
  background-color: ${({ filter }) =>
    filter !== undefined ? getFilterColor(filter) : '#fff'};
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
            <Checkbox
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
        <Checkbox
          label={
            <FilterName>
              Sweden ({getCountByFilter(FilterState.Sweden, doMarketFilter)}) 🇸🇪
            </FilterName>
          }
          checked={selected.includes(FilterState.Sweden)}
          onChange={() => onToggle(FilterState.Sweden)}
        />
        <Checkbox
          label={
            <FilterName>
              Norway ({getCountByFilter(FilterState.Norway, doMarketFilter)}) 🇳🇴
            </FilterName>
          }
          checked={selected.includes(FilterState.Norway)}
          onChange={() => onToggle(FilterState.Norway)}
        />
        <Checkbox
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
        <Checkbox
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
        <Checkbox
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
