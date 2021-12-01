import styled from '@emotion/styled'
import {
  Fade,
  MainHeadline,
  Spacing,
  StandaloneMessage,
  useFadeAnimation,
} from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { ConversationChat } from 'features/conversations/chat/ConversationChat'
import { MemberSummary } from 'features/conversations/member/MemberSummary'
import { ConversationsOverview } from 'features/conversations/overview/ConversationsOverview'
import {
  FocusItems,
  useFocus,
  useNavigation,
} from 'features/navigation/hooks/use-navigation'
import { FilterStateType } from 'features/questions/FilterSelect'
import { useQuestionGroups } from 'features/questions/hooks/use-question-groups'
import {
  doClaimFilter,
  doMarketFilter,
  doMemberGroupFilter,
} from 'features/questions/utils'
import { useMe } from 'features/user/hooks/use-me'
import { useNumberMemberGroups } from 'features/user/hooks/use-number-member-groups'
import React, { useEffect, useMemo, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import { UserSettingKey } from 'types/generated/graphql'

const Wrapper = styled.div`
  height: 100%;
  overflow: hidden;

  display: grid;
  grid-template-columns: 0.6fr 1fr 0.7fr;
  column-gap: 1em;
`

const FadeWrapper = styled(Fade)`
  &,
  & > div {
    height: 100%;
    flex: 1;
  }
`

const ConversationsPage: React.FC<RouteComponentProps<{
  memberId?: string
}>> = ({ match }) => {
  const { memberId } = match.params
  const history = useHistory()
  const { numberMemberGroups } = useNumberMemberGroups()
  const [questionGroups] = useQuestionGroups(3000)
  const [chatFocused, setChatFocused] = useState(false)
  const { fade, props: fadeProps } = useFadeAnimation({ duration: 300 })
  const { settings, updateSetting } = useMe()

  const getQuestionsFilter = (field) =>
    (settings[field] && settings[field].questions) || []

  const [filters, setFilters] = useState<number[]>([
    ...getQuestionsFilter(UserSettingKey.ClaimStatesFilter),
    ...getQuestionsFilter(UserSettingKey.MemberGroupsFilter),
    ...getQuestionsFilter(UserSettingKey.ClaimComplexityFilter),
    ...getQuestionsFilter(UserSettingKey.MarketFilter),
  ])

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

    if (filters.includes(filter)) {
      setFilters(filters.filter((prevFilter) => filter !== prevFilter))
    } else {
      setFilters([...filters, filter])
    }
  }

  const { focus } = useNavigation()

  useFocus(FocusItems.Claims.name)

  const isUpKeyPressed = useKeyIsPressed(Keys.Up)
  const isDownKeyPressed = useKeyIsPressed(Keys.Down)

  const filteredGroups = useMemo(
    () =>
      filters.length > 0
        ? questionGroups
            .filter(doMemberGroupFilter(numberMemberGroups)(filters))
            .filter(doMarketFilter(filters))
            .filter(doClaimFilter(filters))
        : [...questionGroups],
    [questionGroups, filters, numberMemberGroups],
  )

  const currentQuestionOrder = useMemo(
    () => filteredGroups.findIndex((group) => group.memberId === memberId),
    [filteredGroups, memberId, filters],
  )

  useEffect(() => {
    if (
      chatFocused ||
      (!isUpKeyPressed && !isDownKeyPressed) ||
      !memberId ||
      filteredGroups.length <= 1 ||
      currentQuestionOrder === filteredGroups.length
    ) {
      return
    }

    if (
      isDownKeyPressed &&
      currentQuestionOrder < filteredGroups.length - 1 &&
      focus === FocusItems.Conversations.name
    ) {
      fade('up', 'out').then(() => {
        history.push(
          `/conversations/${
            filteredGroups[currentQuestionOrder + 1]?.memberId
          }`,
        )
      })
    }

    if (
      isUpKeyPressed &&
      currentQuestionOrder > 0 &&
      focus === FocusItems.Conversations.name
    ) {
      fade('down', 'out').then(() => {
        history.push(
          `/conversations/${
            filteredGroups[currentQuestionOrder - 1]?.memberId
          }`,
        )
      })
    }
  }, [isDownKeyPressed, isUpKeyPressed])

  useEffect(() => {
    if (!filteredGroups.length) {
      return
    }

    if (filteredGroups.find((group) => group.memberId === memberId)) {
      history.push(`/conversations/${memberId}`)
      return
    }

    history.push(`/conversations/${filteredGroups[0].memberId}`)
  }, [filteredGroups])

  return (
    <>
      <MainHeadline>Conversations</MainHeadline>
      {memberId ? (
        <Wrapper>
          {currentQuestionOrder !== -1 ? (
            <>
              <FadeWrapper {...fadeProps}>
                <MemberSummary memberId={memberId} />
              </FadeWrapper>
              <FadeWrapper {...fadeProps}>
                <ConversationChat
                  memberId={memberId}
                  onFocus={() => setChatFocused(true)}
                  onBlur={() => setChatFocused(false)}
                  onResolve={() =>
                    fade('up', 'out').then(() => {
                      if (currentQuestionOrder === 0) {
                        history.push('/conversations')
                      }

                      if (currentQuestionOrder < filteredGroups.length - 1) {
                        history.push(
                          `/conversations/${
                            filteredGroups[currentQuestionOrder + 1].memberId
                          }`,
                        )
                      }

                      if (currentQuestionOrder === filteredGroups.length - 1) {
                        history.push(
                          `/conversations/${
                            filteredGroups[currentQuestionOrder - 1].memberId
                          }`,
                        )
                      }
                    })
                  }
                />
              </FadeWrapper>
            </>
          ) : (
            <>
              <div />
              <div />
            </>
          )}

          <ConversationsOverview
            currentQuestionOrder={currentQuestionOrder}
            filteredGroups={filteredGroups}
            currentMemberId={memberId}
            filters={filters}
            setFilters={toggleFilterHandler}
          />
        </Wrapper>
      ) : (
        <div>
          <StandaloneMessage paddingTop="15vh">
            Nice, that's it for now!
          </StandaloneMessage>
          <Spacing top="large" />
          <ConversationsOverview
            currentQuestionOrder={currentQuestionOrder}
            filteredGroups={filteredGroups}
            currentMemberId={memberId}
            filters={filters}
            setFilters={toggleFilterHandler}
          />
        </div>
      )}
    </>
  )
}

export default ConversationsPage
