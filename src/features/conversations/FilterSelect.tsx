import styled from '@emotion/styled'
import { ButtonsGroup, FadeIn } from '@hedvig-ui'
import {
  doClaimFilter,
  doMarketFilter,
  doMemberGroupFilter,
} from 'features/conversations/utils/filters'
import { FilterState, getFilterColor } from 'features/questions/filter'
import { useQuestionGroups } from 'graphql/use-question-groups'
import React from 'react'
import { Shield, ShieldShaded } from 'react-bootstrap-icons'
import { QuestionGroup } from 'types/generated/graphql'
import { range } from 'utils/array'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'

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

  :hover {
    background-color: ${({ theme, selected }) =>
      selected ? theme.accent : theme.accentLight};
    color: ${({ theme, selected }) =>
      selected ? theme.accentLight : theme.accent};
  }
`

const GroupIcon = styled.div<{ filter: FilterState }>`
  width: 1em;
  height: 1em;
  background-color: ${({ filter }) => getFilterColor(filter)};
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
  filters: ReadonlyArray<FilterState>
  onToggle: (filter: FilterState) => void
  animationDelay?: number
  animationItemDelay?: number
}> = ({ filters, onToggle, animationDelay = 700, animationItemDelay = 70 }) => {
  const [questionGroups] = useQuestionGroups()

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
      <ButtonsGroup style={{ justifyContent: 'center' }}>
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
                {FilterState[memberGroup]} group{' '}
                <GroupIcon
                  filter={memberGroup as FilterState}
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
      <ButtonsGroup style={{ justifyContent: 'center', marginTop: '1.0em' }}>
        <FadeIn
          delay={`${animationDelay +
            animationItemDelay * (numberMemberGroups + 1)}ms`}
        >
          <FilterButton
            selected={filters.includes(FilterState.Sweden)}
            onClick={() => onToggle(FilterState.Sweden)}
          >
            Sweden <span style={{ marginLeft: '0.5em' }}>🇸🇪</span>
            <CountBadge selected={filters.includes(FilterState.Sweden)}>
              <div>{getCountByFilter(FilterState.Sweden, doMarketFilter)}</div>
            </CountBadge>
          </FilterButton>
        </FadeIn>
        <FadeIn
          delay={`${animationDelay +
            animationItemDelay * (numberMemberGroups + 2)}ms`}
        >
          <FilterButton
            selected={filters.includes(FilterState.Norway)}
            onClick={() => onToggle(FilterState.Norway)}
          >
            Norway <span style={{ marginLeft: '0.5em' }}>🇳🇴</span>
            <CountBadge selected={filters.includes(FilterState.Norway)}>
              <div>{getCountByFilter(FilterState.Norway, doMarketFilter)}</div>
            </CountBadge>
          </FilterButton>
        </FadeIn>
        <FadeIn
          delay={`${animationDelay +
            animationItemDelay * (numberMemberGroups + 3)}ms`}
        >
          <FilterButton
            selected={filters.includes(FilterState.Denmark)}
            onClick={() => onToggle(FilterState.Denmark)}
          >
            Denmark <span style={{ marginLeft: '0.5em' }}>🇩🇰</span>
            <CountBadge selected={filters.includes(FilterState.Denmark)}>
              <div>{getCountByFilter(FilterState.Denmark, doMarketFilter)}</div>
            </CountBadge>
          </FilterButton>
        </FadeIn>
      </ButtonsGroup>
      <ButtonsGroup style={{ justifyContent: 'center', marginTop: '1.0em' }}>
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
