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
import { useInsecurePersistentState } from 'utils/state'

const fadeOutKeyframes = () =>
  keyframes({
    from: { opacity: 1, transform: 'translateY(0)' },
    to: { opacity: 0, transform: 'translateY(-5%)' },
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
`

const FadeOut: React.FC<{
  animate: boolean
  onCompleted: () => void
  children: React.ReactNode
}> = ({ animate, onCompleted, children }) => {
  const animationDuration = 400

  useEffect(() => {
    if (animate) {
      setTimeout(() => {
        onCompleted()
      }, animationDuration)
    }
  }, [animate])

  return (
    <FadeOutWrapper duration={animationDuration}>
      <div className={animate ? 'fadeout' : ''}>{children}</div>
    </FadeOutWrapper>
  )
}

export const ConversationsPage: React.FC<RouteComponentProps<{
  memberId?: string
}>> = ({ match }) => {
  const { memberId } = match.params
  const history = useHistory()
  const [questionGroups] = useQuestionGroups()
  const [animate, setAnimate] = useState(false)
  const [onboarded, setOnboarded] = useInsecurePersistentState<boolean>(
    'conversations:onboarded',
    false,
  )

  useResolveConversation(() => {
    setAnimate(true)
  }, memberId)

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
          <FadeOut
            animate={animate}
            onCompleted={() => {
              setAnimate(false)
              history.push('/conversations')
            }}
          >
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
