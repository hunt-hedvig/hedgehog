import styled from '@emotion/styled'
import {
  Fade,
  MainHeadline,
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
import { FilterState } from 'features/questions/filter'
import { useQuestionGroups } from 'graphql/use-question-groups'
import React, { useEffect, useMemo, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'
import {
  doClaimFilter,
  doMarketFilter,
  doMemberGroupFilter,
} from 'utils/questionGroup'
import { useInsecurePersistentState } from 'utils/state'

const FadeGrid = styled(Fade)`
  height: 100%;

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
  const { fade, props: fadeProps } = useFadeAnimation({ duration: 300 })

  const [filters] = useInsecurePersistentState<ReadonlyArray<FilterState>>(
    'questions:filters',
    [],
  )

  const isUpKeyPressed = useKeyIsPressed(Keys.Up)
  const isDownKeyPressed = useKeyIsPressed(Keys.Down)

  const filteredGroups = useMemo(
    () =>
      questionGroups
        .filter(doMemberGroupFilter(numberMemberGroups)(filters))
        .filter(doMarketFilter(filters))
        .filter(doClaimFilter(filters)),
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
            filteredGroups={filteredGroups}
            currentMemberId={memberId}
          />
        </FadeGrid>
      ) : (
        <StandaloneMessage>Nice, that's it for now!</StandaloneMessage>
      )}
    </>
  )
}

export default ConversationsPage
