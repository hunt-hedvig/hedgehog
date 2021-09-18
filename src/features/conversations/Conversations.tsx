import { Flex, MainHeadline } from '@hedvig-ui'
import { ConversationChat } from 'features/conversations/ConversationChat'
import { FilterSelect } from 'features/conversations/FilterSelect'
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

  return (
    <>
      <MainHeadline>Conversations</MainHeadline>
      <Flex direction={'row'} justify={'space-between'}>
        <Flex style={{ width: '30%' }} direction={'column'}></Flex>
        <Flex
          direction="column"
          style={{ width: '40%', margin: '0em 2em', padding: '2em' }}
        >
          <ConversationChat />
        </Flex>
        <Flex style={{ width: '30%', padding: '2em' }}></Flex>
      </Flex>
    </>
  )
}
