import styled from '@emotion/styled'
import { ButtonsGroup, FadeIn } from '@hedvig-ui'
import { range } from '@hedvig-ui/utils/range'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import {
  Market,
  MarketFlags,
  MemberGroupColors,
  MemberGroups,
} from 'features/config/constants'
import {
  doClaimFilter,
  doMarketFilter,
  doMemberGroupFilter,
} from 'features/questions/utils'
import { useNumberMemberGroups } from 'features/user/hooks/use-number-member-groups'
import { useQuestionGroups } from 'graphql/questions/use-question-groups'
import React from 'react'
import { Shield, ShieldShaded } from 'react-bootstrap-icons'
import { QuestionGroup } from 'types/generated/graphql'

export const FilterState = {
  ...Object.keys(MemberGroups).reduce((acc, group, index) => {
    acc[group] = index
    return acc
  }, {}),
  HasOpenClaim: Object.keys(MemberGroups).length,
  NoOpenClaim: Object.keys(MemberGroups).length + 1,
  ...Object.keys(Market).reduce((acc, market, index) => {
    acc[market] = Object.keys(MemberGroups).length + 2 + index
    return acc
  }, {}),
}

export type FilterStateType = number

const FilterButton = styled.button<{ selected: boolean }>`
  border: none;
  display: inline-flex;
  background-color: ${({ theme, selected }) =>
    selected ? theme.accent : theme.backgroundTransparent};
  padding: 0.4em 0.7em;
  border-radius: 6px;
  transition: all 200ms;
  cursor: pointer;
  align-items: center;
  color: ${({ theme, selected }) =>
    selected ? theme.accentContrast : theme.semiStrongForeground};
  font-family: inherit;

  :hover {
    background-color: ${({ theme, selected }) =>
      selected ? theme.accent : theme.accentLight};
    color: ${({ theme, selected }) =>
      selected ? theme.accentLight : theme.accent};
  }
`

const GroupIcon = styled.div<{ filter: FilterStateType }>`
  width: 1em;
  height: 1em;
  background-color: ${({ filter }) => MemberGroupColors[filter + 1]};
  border-radius: 3px;
`

const CountBadge = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  background-color: ${({ theme }) => theme.backgroundTransparent};
  border-radius: 3px;
  text-align: center;
  color: ${({ theme, selected }) =>
    selected ? theme.accentContrast : theme.semiStrongForeground};

  transition: all 200ms;
  div {
    font-size: 0.75em;
  }
`

export const FilterSelect: React.FC<{
  filters: ReadonlyArray<FilterStateType>
  onToggle: (filter: FilterStateType) => void
  animationDelay?: number
  animationItemDelay?: number
  pushLeft?: boolean
}> = ({
  filters,
  onToggle,
  animationDelay = 700,
  animationItemDelay = 70,
  pushLeft,
}) => {
  const [questionGroups] = useQuestionGroups()

  const getCountByFilter = (
    filter: FilterStateType,
    filterer: (
      selectedFilters: FilterStateType[],
    ) => (questionGroup: QuestionGroup) => boolean,
  ) => {
    return questionGroups.filter(filterer([filter])).length
  }

  const { numberMemberGroups } = useNumberMemberGroups()

  return (
    <>
      <ButtonsGroup style={{ justifyContent: pushLeft ? 'left' : 'center' }}>
        {range(numberMemberGroups).map((memberGroup) => {
          return (
            <FadeIn
              delay={`${animationDelay + animationItemDelay * memberGroup}ms`}
              key={memberGroup}
            >
              <FilterButton
                onClick={() => onToggle(memberGroup)}
                selected={filters.includes(memberGroup)}
              >
                {Object.keys(FilterState).find((filter) => {
                  return FilterState[filter] === memberGroup
                })}{' '}
                group{' '}
                <GroupIcon
                  filter={memberGroup as FilterStateType}
                  style={{ marginLeft: '0.5em' }}
                />
                <CountBadge selected={filters.includes(memberGroup)}>
                  <div>
                    {getCountByFilter(
                      memberGroup,
                      doMemberGroupFilter(numberMemberGroups),
                    )}
                  </div>
                </CountBadge>
              </FilterButton>
            </FadeIn>
          )
        })}
      </ButtonsGroup>
      <ButtonsGroup
        style={{
          justifyContent: pushLeft ? 'left' : 'center',
          marginTop: '1.0em',
        }}
      >
        {Object.keys(Market).map((market) => {
          return (
            <FadeIn
              delay={`${animationDelay +
                animationItemDelay * (numberMemberGroups + 1)}ms`}
              key={market}
            >
              <FilterButton
                selected={filters.includes(FilterState[market])}
                onClick={() => onToggle(FilterState[market])}
              >
                {convertEnumToTitle(market)}{' '}
                <span style={{ marginLeft: '0.5em' }}>
                  {MarketFlags[market.toUpperCase()]}
                </span>
                <CountBadge selected={filters.includes(FilterState[market])}>
                  <div>
                    {getCountByFilter(FilterState[market], doMarketFilter)}
                  </div>
                </CountBadge>
              </FilterButton>
            </FadeIn>
          )
        })}
      </ButtonsGroup>
      <ButtonsGroup
        style={{
          justifyContent: pushLeft ? 'left' : 'center',
          marginTop: '1.0em',
        }}
      >
        <FadeIn
          delay={`${animationDelay +
            animationItemDelay * (numberMemberGroups + 4)}ms`}
        >
          <FilterButton
            selected={filters.includes(FilterState.HasOpenClaim)}
            onClick={() => onToggle(FilterState.HasOpenClaim)}
          >
            Open claims <ShieldShaded style={{ marginLeft: '0.5rem' }} />
            <CountBadge selected={filters.includes(FilterState.HasOpenClaim)}>
              <div>
                {getCountByFilter(FilterState.HasOpenClaim, doClaimFilter)}
              </div>
            </CountBadge>
          </FilterButton>
        </FadeIn>
        <FadeIn
          delay={`${animationDelay +
            animationItemDelay * (numberMemberGroups + 5)}ms`}
        >
          <FilterButton
            selected={filters.includes(FilterState.NoOpenClaim)}
            onClick={() => onToggle(FilterState.NoOpenClaim)}
          >
            No claims <Shield style={{ marginLeft: '0.5rem' }} />
            <CountBadge selected={filters.includes(FilterState.NoOpenClaim)}>
              <div>
                {getCountByFilter(FilterState.NoOpenClaim, doClaimFilter)}
              </div>
            </CountBadge>
          </FilterButton>
        </FadeIn>
      </ButtonsGroup>
    </>
  )
}
