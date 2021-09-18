import { Button, Flex, MainHeadline } from '@hedvig-ui'
import { ConversationChat } from 'features/conversations/chat/ConversationChat'
import { FilterSelect } from 'features/conversations/FilterSelect'
import { MemberSummary } from 'features/conversations/member/MemberSummary'
import { ConversationsRemaining } from 'features/conversations/overview/ConversationsRemaining'
import { FilterState } from 'features/questions/filter'
import { useQuestionGroups } from 'graphql/use-question-groups'
import React, { useState } from 'react'
import { useInsecurePersistentState } from 'utils/state'

export const Conversations: React.FC = () => {
  const [questionGroups] = useQuestionGroups()
  const [showSetup, setShowSetup] = useState(true)
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

  if (showSetup) {
    return (
      <FilterSelect
        filters={filters}
        onSubmit={() => setShowSetup(false)}
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

  console.log(questionGroups)

  return (
    <>
      <MainHeadline>Conversations</MainHeadline>
      <Flex direction={'row'} justify={'space-between'}>
        <Flex style={{ width: '30%', paddingTop: '1em' }} direction={'column'}>
          <MemberSummary memberId={'210227659'} />
        </Flex>
        <Flex
          direction="column"
          style={{ width: '40%', margin: '0em 2em', padding: '1em' }}
        >
          <ConversationChat />
        </Flex>
        <Flex direction="column" style={{ width: '30%', paddingTop: '1em' }}>
          <Flex fullWidth justify={'flex-end'}>
            <Button
              size={'small'}
              variation="ghost"
              style={{ marginLeft: '1.0em' }}
            >
              Turn off this feature
            </Button>
            <Button
              size={'small'}
              variation="ghost"
              style={{ marginLeft: '1.0em' }}
            >
              Give feedback
            </Button>
          </Flex>
          <Flex direction={'column'} align={'center'} fullWidth>
            <ConversationsRemaining count={questionGroups.length} />
            <Button size={'small'} style={{ marginTop: '2.0em' }}>
              Change filters
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
