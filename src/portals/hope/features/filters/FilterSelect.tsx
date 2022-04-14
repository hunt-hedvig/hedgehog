import styled from '@emotion/styled'
import { ButtonsGroup, FadeIn } from '@hedvig-ui'
import { range } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui'
import {
  Market,
  MarketFlags,
  MemberGroupColors,
  MemberGroups,
  PickedLocale,
  PickedLocaleMarket,
} from 'portals/hope/features/config/constants'
import { useQuestionGroups } from 'portals/hope/features/filters/hooks/use-question-groups'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import React from 'react'
import { useNavigation } from '@hedvig-ui'
import { QuestionGroup, UserSettings } from 'types/generated/graphql'
import { Keys } from '@hedvig-ui'
import { useMyMarkets } from 'portals/hope/common/hooks/use-my-markets'
import { motion } from 'framer-motion'

const getGroupNumberForMember = (
  memberId: string,
  numberMemberGroups: number,
) => {
  const memberIdNumber = Number(memberId)
  return memberIdNumber % numberMemberGroups
}

export const doMemberGroupFilter =
  (numberMemberGroups: number) =>
  (selectedFilters: ReadonlyArray<FilterStateType>) =>
  (questionGroup: QuestionGroup): boolean => {
    return range(numberMemberGroups)
      .map(
        (memberGroupNumber) =>
          selectedFilters.includes(memberGroupNumber) &&
          getGroupNumberForMember(
            questionGroup.memberId,
            numberMemberGroups,
          ) === memberGroupNumber,
      )
      .includes(true)
  }

export const doMarketFilter =
  (selectedFilters: ReadonlyArray<FilterStateType>) =>
  (questionGroup: QuestionGroup): boolean => {
    const questionGroupMarket = questionGroup?.market
      ? questionGroup.market
      : questionGroup.pickedLocale
      ? PickedLocaleMarket[questionGroup.pickedLocale as PickedLocale]
      : Market.Sweden

    return Object.keys(Market).some(
      (market) =>
        selectedFilters.includes(FilterState[market]) &&
        questionGroupMarket === market.toUpperCase(),
    )
  }

export const FilterState: Record<string, number> = {
  ...Object.keys(MemberGroups).reduce<Record<string, number>>(
    (acc, group, index) => {
      acc[group] = index
      return acc
    },
    {},
  ),
  ...Object.keys(Market).reduce<Record<string, number>>(
    (acc, market, index) => {
      acc[market] = Object.keys(MemberGroups).length + index
      return acc
    },
    {},
  ),
}

export type FilterStateType = number

const FilterButton = styled(motion.button)<{
  selected: boolean
  small?: boolean
}>`
  border: none;
  display: inline-flex;
  background-color: ${({ theme, selected }) =>
    selected ? theme.accent : theme.backgroundTransparent};
  padding: ${({ small }) => (!small ? '0.4em 0.7em' : '0.3em 0.6em')};
  border-radius: 6px;
  transition: all 50ms;
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
  onToggle: (filter: FilterStateType, settingField: keyof UserSettings) => void
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
              onToggle(memberGroup, 'memberGroupsFilterQuestions')
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                small={small}
                onClick={() =>
                  onToggle(memberGroup, 'memberGroupsFilterQuestions')
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  small={small}
                  selected={filters.includes(FilterState[market])}
                  onClick={() =>
                    onToggle(FilterState[market], 'marketFilterQuestions')
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
    </>
  )
}
