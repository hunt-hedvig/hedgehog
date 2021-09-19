import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Flex, MainHeadline, StandaloneMessage } from '@hedvig-ui'
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

const fadeOutUpKeyframes = () =>
  keyframes({
    from: { opacity: 1, transform: 'translateY(0)' },
    to: { opacity: 0, transform: 'translateY(-3%)' },
  })

const fadeOutDownKeyframes = () =>
  keyframes({
    from: { opacity: 1, transform: 'translateY(0)' },
    to: { opacity: 0, transform: 'translateY(3%)' },
  })

const fadeInUpKeyframes = () =>
  keyframes({
    from: { opacity: 0, transform: 'translateY(5%)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  })

const fadeInDownKeyframes = () =>
  keyframes({
    from: { opacity: 0, transform: 'translateY(-5%)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  })

const FadeOutWrapper = styled.div<{
  duration?: number
  delay?: number
}>`
  width: 100%;

  .out.up {
    animation: ${fadeOutUpKeyframes()} ${({ duration = 400 }) => duration}ms
      ease-out forwards;
    animation-delay: ${({ delay = 0 }) => delay}ms;
  }

  .out.down {
    animation: ${fadeOutDownKeyframes()} ${({ duration = 400 }) => duration}ms
      ease-out forwards;
    animation-delay: ${({ delay = 0 }) => delay}ms;
  }

  .in.up {
    animation: ${fadeInUpKeyframes()} ${({ duration = 400 }) => duration}ms
      ease-in forwards;
    animation-delay: ${({ delay = 0 }) => delay}ms;
  }

  .in.down {
    animation: ${fadeInDownKeyframes()} ${({ duration = 400 }) => duration}ms
      ease-in forwards;
    animation-delay: ${({ delay = 0 }) => delay}ms;
  }
`

const Fade: React.FC<{
  children: React.ReactNode
  duration: number
  type: FadeType | null
  direction: FadeDirection | null
}> = ({ duration, type, direction, children }) => {
  return (
    <FadeOutWrapper duration={duration}>
      <div className={(type ?? '') + ' ' + (direction ?? '')}>{children}</div>
    </FadeOutWrapper>
  )
}

type FadeDirection = 'up' | 'down'
type FadeType = 'in' | 'out'

export const ConversationsPage: React.FC<RouteComponentProps<{
  memberId?: string
}>> = ({ match }) => {
  const animationDuration = 300
  const { memberId } = match.params
  const history = useHistory()
  const { numberMemberGroups } = useNumberMemberGroups()
  const [questionGroups] = useQuestionGroups(3000)
  const [
    animationDirection,
    setAnimationDirection,
  ] = useState<FadeDirection | null>(null)
  const [animationType, setAnimationType] = useState<FadeType | null>(null)

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

  const fade = (direction: FadeDirection, type: FadeType) =>
    new Promise((resolve) => {
      setAnimationDirection(direction)
      setAnimationType(type)
      setTimeout(() => {
        resolve()
        setAnimationType('in')
      }, animationDuration)
    })

  useEffect(() => {
    if (
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
                <Fade
                  duration={animationDuration}
                  type={animationType}
                  direction={animationDirection}
                >
                  <MemberSummary memberId={memberId} />
                </Fade>
              </Flex>
              <Flex span={3} style={{ padding: '0 2em' }}>
                <Fade
                  duration={animationDuration}
                  type={animationType}
                  direction={animationDirection}
                >
                  <ConversationChat memberId={memberId} />
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
            conversationsRemaining={filteredGroups.length}
          />
        </Flex>
      </Flex>
    </>
  )
}
