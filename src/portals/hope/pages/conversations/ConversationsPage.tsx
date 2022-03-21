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
import { ConversationChat } from 'portals/hope/features/conversations/chat/ConversationChat'
import { MemberSummary } from 'portals/hope/features/conversations/member/MemberSummary'
import { ConversationsOverview } from 'portals/hope/features/conversations/overview/ConversationsOverview'
import { useQuestionGroups } from 'portals/hope/features/questions/hooks/use-question-groups'
import {
  doMarketFilter,
  doMemberGroupFilter,
} from 'portals/hope/features/questions/utils'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import React, { useEffect, useMemo, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import { Page } from 'portals/hope/pages/routes'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'
import { useSelectedFilters } from '../../features/questions/hooks/use-selected-filters'

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

const ConversationsPage: Page<
  RouteComponentProps<{
    memberId?: string
  }>
> = ({ match }) => {
  const { memberId } = match.params
  const history = useHistory()
  const { numberMemberGroups } = useNumberMemberGroups()
  const [questionGroups] = useQuestionGroups(3000)
  const [chatFocused, setChatFocused] = useState(false)
  const { fade, props: fadeProps } = useFadeAnimation({ duration: 300 })

  const { selectedFilters: filters, toggleFilter: toggleFilterHandler } =
    useSelectedFilters()

  const isUpKeyPressed = useKeyIsPressed(Keys.Up)
  const isDownKeyPressed = useKeyIsPressed(Keys.Down)

  const filteredGroups = useMemo(
    () =>
      filters.length > 0
        ? questionGroups
            .filter(doMemberGroupFilter(numberMemberGroups)(filters))
            .filter(doMarketFilter(filters))
        : [...questionGroups],
    [questionGroups, filters, numberMemberGroups],
  )

  const currentQuestionOrder = useMemo(
    () => filteredGroups.findIndex((group) => group.memberId === memberId),
    [filteredGroups, memberId, filters],
  )

  const { cursor } = useNavigation()

  useEffect(() => {
    if (
      chatFocused ||
      (!isUpKeyPressed && !isDownKeyPressed) ||
      !memberId ||
      filteredGroups.length <= 1 ||
      currentQuestionOrder === filteredGroups.length ||
      !!cursor
    ) {
      return
    }

    if (isDownKeyPressed && currentQuestionOrder < filteredGroups.length - 1) {
      fade('up', 'out').then(() => {
        history.push(
          `/conversations/${
            filteredGroups[currentQuestionOrder + 1]?.memberId
          }`,
        )
      })
    }

    if (isUpKeyPressed && currentQuestionOrder > 0) {
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
