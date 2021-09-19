import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Flex, MainHeadline, StandaloneMessage } from '@hedvig-ui'
import { ConversationChat } from 'features/conversations/chat/ConversationChat'
import { FilterSelect } from 'features/conversations/FilterSelect'
import { MemberSummary } from 'features/conversations/member/MemberSummary'
import {
  ConversationsOverview,
  useResolveConversation,
} from 'features/conversations/UseResolveConversation'
import { FilterState } from 'features/questions/filter'
import { useQuestionGroups } from 'graphql/use-question-groups'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import { Keys, useKeyIsPressed } from 'utils/hooks/key-press-hook'
import { useInsecurePersistentState } from 'utils/state'

const fadeOutKeyframes = () =>
  keyframes({
    from: { opacity: 1, transform: 'translateY(0)' },
    to: { opacity: 0, transform: 'translateY(-5%)' },
  })

const fadeInKeyframes = () =>
  keyframes({
    from: { opacity: 0, transform: 'translateY(5%)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  })

const FadeOutWrapper = styled.div<{
  duration?: number
  delay?: number
}>`
  width: 100%;
  .fadeout {
    animation: ${fadeOutKeyframes()} ${({ duration = 400 }) => duration}ms
      ease-out forwards;
    animation-delay: ${({ delay = 0 }) => delay}ms;
  }

  .fadein {
    animation: ${fadeInKeyframes()} ${({ duration = 400 }) => duration}ms
      ease-in forwards;
    animation-delay: ${({ delay = 0 }) => delay}ms;
  }
`

const FadeOut: React.FC<{
  animate: boolean
  children: React.ReactNode
  duration: number
}> = ({ animate, duration, children }) => {
  return (
    <FadeOutWrapper duration={duration}>
      <div className={animate ? 'fadeout' : 'fadein'}>{children}</div>
    </FadeOutWrapper>
  )
}

export const ConversationsPage: React.FC<RouteComponentProps<{
  memberId?: string
}>> = ({ match }) => {
  const animationDuration = 400
  const { memberId } = match.params
  const history = useHistory()
  const [questionGroups] = useQuestionGroups()
  const [animate, setAnimate] = useState(false)
  const [onboarded, setOnboarded] = useInsecurePersistentState<boolean>(
    'conversations:onboarded',
    false,
  )

  const isUpKeyPressed = useKeyIsPressed(Keys.Up)
  const isDownKeyPressed = useKeyIsPressed(Keys.Down)

  const fadeOut = () =>
    new Promise((resolve) => {
      setAnimate(true)
      setTimeout(() => {
        resolve()
        setAnimate(false)
      }, animationDuration)
    })

  useEffect(() => {
    if (!isUpKeyPressed && !isDownKeyPressed) {
      return
    }

    if (!memberId) {
      return
    }

    if (questionGroups.length <= 1) {
      return
    }

    const currentQuestionOrder = questionGroups.findIndex(
      (group) => group.memberId === memberId,
    )

    if (currentQuestionOrder === questionGroups.length) {
      return
    }

    if (isDownKeyPressed && currentQuestionOrder < questionGroups.length - 1) {
      fadeOut().then(() => {
        history.push(
          `/conversations/${
            questionGroups[currentQuestionOrder + 1]?.memberId
          }`,
        )
      })
    }

    if (isUpKeyPressed && currentQuestionOrder > 0) {
      fadeOut().then(() => {
        history.push(
          `/conversations/${
            questionGroups[currentQuestionOrder - 1]?.memberId
          }`,
        )
      })
    }
  }, [isDownKeyPressed, isUpKeyPressed])

  useResolveConversation(
    () =>
      fadeOut().then(() =>
        history.push(`/conversations/${questionGroups[0]?.memberId}`),
      ),
    memberId,
  )

  const [filters, setFilters] = useInsecurePersistentState<
    ReadonlyArray<FilterState>
  >('questions:filters', [
    FilterState.First,
    FilterState.Second,
    FilterState.Third,
    FilterState.Sweden,
    FilterState.Norway,
    FilterState.HasOpenClaim,
    FilterState.NoOpenClaim,
  ])

  useEffect(() => {
    if (!questionGroups.length) {
      return
    }

    if (questionGroups.find((group) => group.memberId === memberId)) {
      history.push(`/conversations/${memberId}`)
      return
    }

    history.push(`/conversations/${questionGroups[0].memberId}`)
  }, [questionGroups])

  if (!onboarded) {
    return (
      <FilterSelect
        filters={filters}
        onSubmit={() => setOnboarded(true)}
        onToggle={(filter) => {
          if (filters.includes(filter)) {
            setFilters(filters.filter((prevFilter) => filter !== prevFilter))
          } else {
            setFilters([...filters, filter])
          }
        }}
      />
    )
  }

  return (
    <>
      <MainHeadline>Conversations</MainHeadline>
      <Flex direction={'row'} justify={'space-between'}>
        {memberId ? (
          <FadeOut duration={animationDuration} animate={animate}>
            <Flex direction={'row'} fullWidth>
              <Flex
                style={{ paddingTop: '1em', width: '40%' }}
                direction={'column'}
              >
                <MemberSummary memberId={memberId} />
              </Flex>
              <Flex
                direction="column"
                style={{ margin: '0em 2em', padding: '1em', width: '60%' }}
              >
                <ConversationChat memberId={memberId} />
              </Flex>
            </Flex>
          </FadeOut>
        ) : (
          <Flex style={{ paddingTop: '1em' }} direction={'column'}>
            <StandaloneMessage paddingTop={'25vh'}>
              No more conversations
            </StandaloneMessage>
          </Flex>
        )}
        <Flex direction="column" style={{ paddingTop: '1em', width: '30%' }}>
          <ConversationsOverview
            conversationsRemaining={questionGroups.length}
          />
        </Flex>
      </Flex>
    </>
  )
}
