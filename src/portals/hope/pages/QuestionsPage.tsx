import styled from '@emotion/styled'
import {
  FadeIn,
  LoadingMessage,
  Spacing,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import {
  FilterSelect,
  FilterStateType,
} from 'portals/hope/features/questions/FilterSelect'
import { NumberMemberGroupsRadioButtons } from 'portals/hope/features/questions/number-member-groups-radio-buttons'
import { QuestionGroups } from 'portals/hope/features/questions/questions-list/QuestionGroups'
import React, { useState } from 'react'
import { UserSettingKey } from 'types/generated/graphql'
import { Page } from 'portals/hope/pages/routes'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import { useQuestionGroups } from 'portals/hope/features/questions/hooks/use-question-groups'
import { Market } from 'portals/hope/features/config/constants'
import { useMyMarkets } from 'portals/hope/common/hooks/use-my-markets'

const ListPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;
`

const QuestionsPage: Page = () => {
  const { markets: userMarkets } = useMyMarkets()
  const { settings, updateSetting } = useMe()

  const getQuestionsFilter = (field: UserSettingKey) =>
    (settings[field] && settings[field].questions) || []

  const [selectedFilters, setSelectedFilters] = useState<number[]>([
    ...getQuestionsFilter(UserSettingKey.ClaimStatesFilter),
    ...getQuestionsFilter(UserSettingKey.MemberGroupsFilter),
    ...getQuestionsFilter(UserSettingKey.ClaimComplexityFilter),
    ...getQuestionsFilter(UserSettingKey.MarketFilter),
  ])

  // TODO: This is temporary; we'll kill off user settings in this form later
  const intermediateMarketFilterMap: Record<number, Market> = {
    6: Market.Sweden,
    7: Market.Norway,
    8: Market.Denmark,
  }

  const [questionGroups, { loading }] = useQuestionGroups()

  if (loading) {
    return <LoadingMessage paddingTop="25vh" />
  }

  if (!questionGroups) {
    return (
      <StandaloneMessage paddingTop="25vh">
        Something went wrong!
      </StandaloneMessage>
    )
  }

  const toggleFilterHandler = (
    filter: FilterStateType,
    settingField?: UserSettingKey,
  ) => {
    if (settingField) {
      if (settings[settingField] && settings[settingField].questions) {
        updateSetting(settingField, {
          ...settings[settingField],
          questions: settings[settingField].questions.includes(filter)
            ? settings[settingField].questions.filter(
                (prevFilter: number) => filter !== prevFilter,
              )
            : [...settings[settingField].questions, filter],
        })
      } else {
        updateSetting(settingField, {
          ...settings[settingField],
          questions: [filter],
        })
      }
    }

    if (selectedFilters.includes(filter)) {
      setSelectedFilters(
        selectedFilters.filter((prevFilter) => filter !== prevFilter),
      )
    } else {
      setSelectedFilters([...selectedFilters, filter])
    }
  }

  return (
    <ListPage>
      <Spacing bottom="large" top="large">
        <FadeIn>
          <Spacing bottom>
            <ThirdLevelHeadline>
              <strong>Number of member groups</strong>
            </ThirdLevelHeadline>
            <NumberMemberGroupsRadioButtons />
          </Spacing>
          <FilterSelect
            filters={selectedFilters}
            push="left"
            animationDelay={0}
            animationItemDelay={20}
            onToggle={toggleFilterHandler}
          />
        </FadeIn>
      </Spacing>

      <QuestionGroups
        selectedFilters={selectedFilters.filter((filter) => {
          if (filter >= 6 && filter <= 8) {
            return userMarkets.includes(intermediateMarketFilterMap[filter])
          }
          return true
        })}
        questionGroups={questionGroups}
      />
    </ListPage>
  )
}

export default QuestionsPage
