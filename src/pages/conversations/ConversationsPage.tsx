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
import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { ConversationChat } from 'features/conversations/chat/ConversationChat'
import { MemberSummary } from 'features/conversations/member/MemberSummary'
import { ConversationsOverview } from 'features/conversations/overview/ConversationsOverview'
import { FilterStateType } from 'features/questions/FilterSelect'
import { useQuestionGroups } from 'features/questions/hooks/use-question-groups'
import {
  doClaimFilter,
  doMarketFilter,
  doMemberGroupFilter,
} from 'features/questions/utils'
import { useNumberMemberGroups } from 'features/user/hooks/use-number-member-groups'
import React, { useEffect, useMemo, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'

const FadeGrid = styled(Fade)`
  height: 100%;
  overflow: hidden;

  & > div {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1.5fr 0.9fr;
    column-gap: 32px;
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
  const { fade, props: fadeProps } = useFadeAnimation({ duration: 150 })

  const [filters] = useInsecurePersistentState<ReadonlyArray<FilterStateType>>(
    'questions:filters',
    [],
  )

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
    [filteredGroups, memberId],
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
        <FadeGrid {...fadeProps}>
          <MemberSummary memberId={memberId} />
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
          <ConversationsOverview
            currentQuestionOrder={currentQuestionOrder}
            filteredGroups={filteredGroups}
            currentMemberId={memberId}
          />
        </FadeGrid>
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
          />
        </div>
      )}
    </>
  )
}

export default ConversationsPage
