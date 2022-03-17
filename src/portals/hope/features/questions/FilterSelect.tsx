import styled from '@emotion/styled'
import { ButtonsGroup, FadeIn } from '@hedvig-ui'
import { range } from '@hedvig-ui/utils/range'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import {
  Market,
  MarketFlags,
  MemberGroupColors,
  MemberGroups,
} from 'portals/hope/features/config/constants'
import { useQuestionGroups } from 'portals/hope/features/questions/hooks/use-question-groups'
import {
  doClaimFilter,
  doMarketFilter,
  doMemberGroupFilter,
} from 'portals/hope/features/questions/utils'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import React from 'react'
import { Shield, ShieldShaded } from 'react-bootstrap-icons'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'
import { QuestionGroup, UserSettingKey } from 'types/generated/graphql'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useMyMarkets } from 'portals/hope/common/hooks/use-my-markets'

export const FilterState: Record<string, number> = {
  ...Object.keys(MemberGroups).reduce<Record<string, number>>(
    (acc, group, index) => {
      acc[group] = index
      return acc
    },
    {},
  ),
  HasOpenClaim: Object.keys(MemberGroups).length,
  NoOpenClaim: Object.keys(MemberGroups).length + 1,
  ...Object.keys(Market).reduce<Record<string, number>>(
    (acc, market, index) => {
      acc[market] = Object.keys(MemberGroups).length + 2 + index
      return acc
    },
    {},
  ),
}

export type FilterStateType = number

const FilterButton = styled.button<{ selected: boolean; small?: boolean }>`
  border: none;
  display: inline-flex;
  background-color: ${({ theme, selected }) =>
    selected ? theme.accent : theme.backgroundTransparent};
  padding: ${({ small }) => (!small ? '0.4em 0.7em' : '0.3em 0.6em')};
  border-radius: 6px;
  transition: all 200ms;
  cursor: pointer;
  align-items: center;
  color: ${({ theme, selected }) =>
    selected ? theme.accentContrast : theme.semiStrongForeground};
  font-family: inherit;
  font-size: ${({ small }) => (!small ? '16px' : '14px')};

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
  onToggle: (filter: FilterStateType, settingField: UserSettingKey) => void
  animationDelay?: number
  animationItemDelay?: number
  push?: 'left' | 'right'
  small?: boolean
}> = ({
  filters,
  onToggle,
  animationDelay = 700,
  animationItemDelay = 70,
  push,
  small,
}) => {
  const { markets: userMarkets } = useMyMarkets()
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

  const { register } = useNavigation()

  return (
    <>
      <ButtonsGroup style={{ justifyContent: push ? push : 'center' }}>
        {range(numberMemberGroups).map((memberGroup, index) => {
          const navigation = register(`Member Group ${memberGroup} Filter`, {
            focus: index === 0 ? Keys.F : undefined,
            resolve: () => {
              onToggle(memberGroup, UserSettingKey.MemberGroupsFilterQuestions)
            },
            neighbors: {
              left: index
                ? `Member Group ${range(numberMemberGroups)[index - 1]} Filter`
                : undefined,
              right:
                index < range(numberMemberGroups).length - 1
                  ? `Member Group ${
                      range(numberMemberGroups)[index + 1]
                    } Filter`
                  : undefined,
              down: `Market ${Object.keys(Market)[index]} Filter`,
            },
          })

          return (
            <FadeIn
              delay={`${animationDelay + animationItemDelay * memberGroup}ms`}
              key={memberGroup}
              {...navigation}
            >
              <FilterButton
                small={small}
                onClick={() =>
                  onToggle(
                    memberGroup,
                    UserSettingKey.MemberGroupsFilterQuestions,
                  )
                }
                selected={filters.includes(memberGroup)}
              >
                {Object.keys(FilterState).find((filter) => {
                  return FilterState[filter] === memberGroup
                })}{' '}
                group{' '}
                <GroupIcon
                  filter={memberGroup as FilterStateType}
                  style={{ marginLeft: !small ? '0.5em' : '0.3em' }}
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
          justifyContent: push ? push : 'center',
          marginTop: !small ? '1.0em' : '0.6em',
        }}
      >
        {Object.keys(Market)
          .filter((m) => userMarkets.includes(m.toUpperCase() as Market))
          .map((market) => {
            return (
              <FadeIn
                delay={`${
                  animationDelay + animationItemDelay * (numberMemberGroups + 1)
                }ms`}
                key={market}
              >
                <FilterButton
                  small={small}
                  selected={filters.includes(FilterState[market])}
                  onClick={() =>
                    onToggle(
                      FilterState[market],
                      UserSettingKey.MarketFilterQuestions,
                    )
                  }
                >
                  {convertEnumToTitle(market)}{' '}
                  <span style={{ marginLeft: !small ? '0.5em' : '0.3em' }}>
                    {MarketFlags[market.toUpperCase() as Market]}
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
          justifyContent: push ? push : 'center',
          marginTop: !small ? '1.0em' : '0.6em',
        }}
      >
        <FadeIn
          delay={`${
            animationDelay + animationItemDelay * (numberMemberGroups + 4)
          }ms`}
          {...register('Open Claims Filter', {
            resolve: () => {
              onToggle(
                FilterState.HasOpenClaim,
                UserSettingKey.ClaimStatesFilterQuestions,
              )
            },
            neighbors: {
              up: `Market ${Object.keys(Market)[0]} Filter`,
              right: 'No Claims Filter',
            },
          })}
        >
          <FilterButton
            small={small}
            selected={filters.includes(FilterState.HasOpenClaim)}
            onClick={() =>
              onToggle(
                FilterState.HasOpenClaim,
                UserSettingKey.ClaimStatesFilterQuestions,
              )
            }
          >
            Open claims{' '}
            <ShieldShaded style={{ marginLeft: !small ? '0.5em' : '0.3em' }} />
            <CountBadge selected={filters.includes(FilterState.HasOpenClaim)}>
              <div>
                {getCountByFilter(FilterState.HasOpenClaim, doClaimFilter)}
              </div>
            </CountBadge>
          </FilterButton>
        </FadeIn>
        <FadeIn
          delay={`${
            animationDelay + animationItemDelay * (numberMemberGroups + 5)
          }ms`}
          {...register('No Claims Filter', {
            resolve: () => {
              onToggle(
                FilterState.NoOpenClaim,
                UserSettingKey.ClaimStatesFilterQuestions,
              )
            },
            neighbors: {
              up: `Market ${
                Object.keys(Market)[Object.keys(Market).length - 1]
              } Filter`,
              left: 'Open Claims Filter',
            },
          })}
        >
          <FilterButton
            small={small}
            selected={filters.includes(FilterState.NoOpenClaim)}
            onClick={() =>
              onToggle(
                FilterState.NoOpenClaim,
                UserSettingKey.ClaimStatesFilterQuestions,
              )
            }
          >
            No claims{' '}
            <Shield style={{ marginLeft: !small ? '0.5em' : '0.3em' }} />
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
