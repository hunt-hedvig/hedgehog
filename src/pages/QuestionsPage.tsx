import styled from '@emotion/styled'
import {
  Capitalized,
  FadeIn,
  LoadingMessage,
  Spacing,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { FilterSelect, FilterStateType } from 'features/questions/FilterSelect'
import { useQuestionGroups } from 'features/questions/hooks/use-question-groups'
import { NumberMemberGroupsRadioButtons } from 'features/questions/number-member-groups-radio-buttons'
import { QuestionGroups } from 'features/questions/questions-list/QuestionGroups'
import { useMe } from 'features/user/hooks/use-me'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { UserSettingKey } from 'types/generated/graphql'

const ListPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;
`

const ConversationsMessage = styled.div`
  background-color: ${({ theme }) => theme.highlight};
  border: 1px solid ${({ theme }) => theme.highlight};
  color: ${({ theme }) => theme.darkHighlight};
  padding: 1em;
  border-radius: 8px;
  cursor: pointer;
  transition: all 200ms;

  :hover {
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.darkHighlight};
  }
`

const QuestionsPage: React.FC = () => {
  const history = useHistory()
  const { me, settings, updateSetting } = useMe()

  const [selectedFilters, setSelectedFilters] = useState<number[]>([
    ...(settings[UserSettingKey.ClaimStatesFilter].questions || []),
    ...(settings[UserSettingKey.MemberGroupsFilter].questions || []),
    ...(settings[UserSettingKey.ClaimComplexityFilter].questions || []),
    ...(settings[UserSettingKey.MarketFilter].questions || []),
  ])

  const [questionGroups, { loading }] = useQuestionGroups()

  const setEmptyFilter = (field) => {
    if (!settings[field].questions) {
      updateSetting(field, {
        ...settings[field],
        questions: [],
      })
    }
  }

  useEffect(() => {
    setEmptyFilter(UserSettingKey.ClaimStatesFilter)
    setEmptyFilter(UserSettingKey.MemberGroupsFilter)
    setEmptyFilter(UserSettingKey.ClaimComplexityFilter)
    setEmptyFilter(UserSettingKey.MarketFilter)
  }, [])

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
      if (settings[settingField].questions) {
        updateSetting(settingField, {
          ...settings[settingField],
          questions: settings[settingField].questions.includes(filter)
            ? settings[settingField].questions.filter(
                (prevFilter) => filter !== prevFilter,
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
      <ConversationsMessage
        onClick={() => {
          history.push('/conversations/onboarding')
        }}
      >
        Hey there <Capitalized>{me.fullName.split(' ')[0]}</Capitalized>
        !
        <br />
        <span style={{ fontSize: '0.9em' }}>
          We're testing a new version of the question page, want to try it?
        </span>
      </ConversationsMessage>
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
        selectedFilters={selectedFilters}
        questionGroups={questionGroups}
      />
    </ListPage>
  )
}

export default QuestionsPage
