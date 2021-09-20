import {
  Fade,
  Flex,
  MainHeadline,
  StandaloneMessage,
  useFadeAnimation,
} from '@hedvig-ui'
import { ConversationChat } from 'features/conversations/chat/ConversationChat'
import { useResolveConversation } from 'features/conversations/hooks/use-resolve-conversation'
import { MemberSummary } from 'features/conversations/member/MemberSummary'
import { ConversationsOverview } from 'features/conversations/overview/ConversationsOverview'
import { FilterState } from 'features/questions/filter'
import { useQuestionGroups } from 'graphql/use-question-groups'
import React, { useEffect, useMemo, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import { Keys, useKeyIsPressed } from 'utils/hooks/key-press-hook'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'
import {
  doClaimFilter,
  doMarketFilter,
  doMemberGroupFilter,
} from 'utils/questionGroup'
import { useInsecurePersistentState } from 'utils/state'

export const ConversationsPage: React.FC<RouteComponentProps<{
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

  useResolveConversation(
    () =>
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
      }),
    memberId,
  )

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
      <Flex direction={'row'} justify={'space-between'}>
        <Flex direction={'row'} span={3}>
          {memberId ? (
            <>
              <Flex span={2}>
                <Fade {...fadeProps}>
                  <MemberSummary memberId={memberId} />
                </Fade>
              </Flex>
              <Flex span={3} style={{ padding: '0 2em' }}>
                <Fade {...fadeProps}>
                  <ConversationChat
                    memberId={memberId}
                    onFocus={() => setChatFocused(true)}
                    onBlur={() => setChatFocused(false)}
                  />
                </Fade>
              </Flex>
            </>
          ) : (
            <StandaloneMessage paddingTop={'25vh'}>
              Nice, that's it for now!
            </StandaloneMessage>
          )}
        </Flex>
        <Flex direction="column" style={{ marginTop: '1em' }} span={1}>
          <ConversationsOverview
            filteredGroups={filteredGroups}
            currentMemberId={memberId}
          />
        </Flex>
      </Flex>
    </>
  )
}
